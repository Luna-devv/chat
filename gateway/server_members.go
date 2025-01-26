package main

import "log"

func addMemberToServer(serverId int, userId int) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.ServerIds[serverId]; ok {
			client.ServerIds[serverId] = struct{}{}
			log.Printf("Added user %d to %d", userId, serverId)
		}
	}
}

func removeMemberFromServer(serverId int, userId int) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.ServerIds[serverId]; ok {
			delete(client.ServerIds, serverId)
			log.Printf("User %d removed from %d", userId, serverId)
		}
	}
}
