package main

import "log"

func broadcastToServer(serverId int, event Event) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.ServerIds[serverId]; ok {
			sendToClient(client, event)
		}
	}
}

func broadcastToUser(userId int, event Event) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if client.UserId == userId {
			sendToClient(client, event)
		}
	}
}

func sendToClient(client *Client, event Event) {
	err := client.Conn.WriteJSON(event)
	if err != nil {
		log.Println("Failed to send message:", err)
	}
}

func disconnectClient(conID string) {
	clients.Lock()
	if client, ok := clients.connected[conID]; ok {
		client.Conn.Close()
		delete(clients.connected, conID)
	}
	clients.Unlock()
}
