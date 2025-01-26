package main

import (
	"chat/gateway/jwt"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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
	upgrader = websocket.Upgrader{}
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
	token := r.URL.Query().Get("session")
	if len(token) == 0 {
		http.Error(w, "Invalid Authorization", http.StatusForbidden)
		return
	}

	session, err := jwt.Verify(token)
	fmt.Println(session)
	if err != nil {
		http.Error(w, "Invalid Authorization", http.StatusForbidden)
		return
	}

	var user UserTable
	err = pgxscan.Get(context.Background(), db, &user, "SELECT * FROM users WHERE id=$1", session.Id)
	fmt.Println(err)
	if err != nil {
		http.Error(w, "Invalid Authorization", http.StatusForbidden)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}

	conID := fmt.Sprintf("%d", time.Now().UnixMilli())

	client := &Client{
		Conn:     conn,
		UserID:   session.Id,
		GuildIDs: make(map[string]struct{}),
	}

	//for _, gid := range guildIDs {
	//	client.GuildIDs[gid] = struct{}{}
	//}

	clients.Lock()
	clients.connected[conID] = client
	clients.Unlock()

	log.Printf("User %s connected (con: %s)", session.Id, conID)
	defer disconnectClient(conID)

	sendToClient(client, Event{
		Type: "ready",
		Data: ReadEventPayload{
			User: user,
		},
	})

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Println("Connection closed for user:", session.Id)
			break
		}
	}
}

func startRedisSubscription() {
	ctx := context.Background()
	pubsub := redisClient.PSubscribe(ctx, "guild:*", "user:*")

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

	switch event.Type {
	case "guild_member_create":
		userID := event.Data.(map[string]interface{})["userId"].(string)
		guildID := event.Data.(map[string]interface{})["guildId"].(string)
		addMemberToGuild(userID, guildID)
		broadcastToGuild(event.Data.(map[string]interface{})["guild_id"].(string), event)

	case "guild_member_remove":
		userID := event.Data.(map[string]interface{})["userId"].(string)
		guildID := event.Data.(map[string]interface{})["guildId"].(string)
		removeMemberFromGuild(userID, guildID)
		broadcastToGuild(event.Data.(map[string]interface{})["guild_id"].(string), event)

	default:
		if event.Data.(map[string]interface{})["guild_id"] == nil {
			broadcastToUser(event.Data.(map[string]interface{})["user_id"].(string), event)
		} else {
			broadcastToGuild(event.Data.(map[string]interface{})["guild_id"].(string), event)
		}
	}
}
