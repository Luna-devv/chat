package main

import (
	"chat/gateway/clients"
	"chat/gateway/db"
	"chat/gateway/events"
	"chat/gateway/jwt"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	_ "github.com/joho/godotenv/autoload"
	"golang.org/x/net/context"
)

var (
	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // TODO: fix
		},
	}
)

func main() {
	http.HandleFunc("/", handleWebSocket)

	go startRedisSubscription()

	log.Println("WebSocket server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}

	token := jwt.ExtractSessionTokenFromRequest(r)
	session, err := jwt.Verify(token)
	if err != nil {
		ws.Close()
		return
	}

	user, err := db.GetUser(session.Id)
	members, err := db.GetServerMembersForUser(session.Id)
	servers, err := db.GetServersByMembers(members)
	rooms, err := db.GetRoomsByServers(servers)
	if err != nil {
		ws.Close()
		return
	}

	client := &clients.Client{
		Conn:      ws,
		UserId:    session.Id,
		ServerIds: make(map[int]struct{}),
	}

	for _, server := range servers {
		client.ServerIds[server.Id] = struct{}{}
	}

	conId := fmt.Sprintf("%d", time.Now().UnixMilli())

	clients.Add(conId, client)

	log.Printf("User %d connected (con: %s)", session.Id, conId)
	defer clients.Disconnect(conId)

	clients.SendToClient(client, events.Event{
		Type: "ready",
		Data: events.ReadyEventPayload{
			User:               user,
			CurrentUserMembers: members,
			Servers:            servers,
			Rooms:              rooms,
		},
	})

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Println("Connection closed for user:", session.Id)
			break
		}

		var event events.Event
		if err := json.Unmarshal(msg, &event); err != nil {
			// Ignore non-JSON messages
			continue
		}

		events.Handle(client, event)
	}
}

func startRedisSubscription() {
	ctx := context.Background()
	pubsub := redisClient.PSubscribe(ctx, "server:*", "user:*")

	ch := pubsub.Channel()
	for msg := range ch {
		handleRedisMessage(msg)
	}
}

func handleRedisMessage(msg *redis.Message) {
	var event events.Event
	err := json.Unmarshal([]byte(msg.Payload), &event)
	if err != nil {
		log.Println("Failed to parse event:", err)
		return
	}

	if strings.HasPrefix(msg.Channel, "server:") {
		serverIdStr := strings.Split(msg.Channel, ":")[1]

		serverId, err := strconv.Atoi(serverIdStr)
		if err != nil {
			fmt.Println(err)
			return
		}

		clients.BroadcastToServer(serverId, event)
		return
	}

	userIdStr := strings.Split(msg.Channel, ":")[1]

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		fmt.Println(err)
		return
	}

	switch event.Type {
	case "server_create":
		serverId := event.Data.(map[string]interface{})["id"].(float64)

		clients.AddMemberToServer(userId, int(serverId))
		clients.BroadcastToUser(userId, event)

	case "server_delete":
		serverId := event.Data.(map[string]interface{})["id"].(float64)

		clients.RemoveMemberFromServer(userId, int(serverId))
		clients.BroadcastToUser(userId, event)

	default:
		clients.BroadcastToUser(userId, event)
	}
}
