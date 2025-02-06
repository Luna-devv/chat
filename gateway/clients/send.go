package clients

import (
	"log"
)

func BroadcastToServer(serverId int, event interface{}) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.ServerIds[serverId]; ok {
			SendToClient(client, event)
		}
	}
}

func BroadcastToUser(userId int, event interface{}) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if client.UserId == userId {
			SendToClient(client, event)
		}
	}
}

func SendToClient(client *Client, event interface{}) {
	err := client.Conn.WriteJSON(event)
	if err != nil {
		log.Println("Failed to send message:", err)
	}
}
