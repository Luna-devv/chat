package main

import "log"

func broadcastToGuild(guildID string, event Event) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.GuildIDs[guildID]; ok {
			sendToClient(client, event)
		}
	}
}

func broadcastToUser(userID string, event Event) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if client.UserID == userID {
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
