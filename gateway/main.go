package main

import (
	"chat/gateway/jwt"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgxpool"
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

var clients = struct {
	sync.RWMutex
	connected map[string]*Client
}{connected: make(map[string]*Client)}

func main() {
	ctx := context.Background()
	db, _ := pgxpool.New(ctx, "postgres://prod:plschangeme@localhost/chat")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handleWebSocket(w, r, db)
	})

	go startRedisSubscription()

	log.Println("WebSocket server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request, db *pgxpool.Pool) {
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

	var user UserTable
	err = pgxscan.Get(context.Background(), db, &user, "SELECT * FROM users WHERE id=$1", session.Id)
	if err != nil {
		ws.Close()
		return
	}

	conID := fmt.Sprintf("%d", time.Now().UnixMilli())

	client := &Client{
		Conn:      ws,
		UserId:    session.Id,
		ServerIds: make(map[int]struct{}),
	}

	//for _, gid := range ServerIds {
	//	client.ServerIds[gid] = struct{}{}
	//}

	clients.Lock()
	clients.connected[conID] = client
	clients.Unlock()

	log.Printf("User %d connected (con: %s)", session.Id, conID)
	defer disconnectClient(conID)

	sendToClient(client, Event{
		Type: "ready",
		Data: ReadEventPayload{
			User: user,
		},
	})

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			log.Println("Connection closed for user:", session.Id)
			break
		}
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
	var event Event
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

		broadcastToServer(serverId, event)
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

		addMemberToServer(userId, int(serverId))
		broadcastToUser(userId, event)

	case "server_delete":
		serverId := event.Data.(map[string]interface{})["id"].(float64)

		removeMemberFromServer(userId, int(serverId))
		broadcastToUser(userId, event)

	default:
		broadcastToUser(userId, event)
	}
}
