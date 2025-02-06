package clients

import "log"

func AddMemberToServer(userId int, serverId int) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if client.UserId == userId {
			client.ServerIds[serverId] = struct{}{}
			log.Printf("Added user %d to %d", userId, serverId)
		}
	}
}

func RemoveMemberFromServer(userId int, serverId int) {
	clients.RLock()
	defer clients.RUnlock()

	for _, client := range clients.connected {
		if _, ok := client.ServerIds[serverId]; ok {
			delete(client.ServerIds, serverId)
			log.Printf("User %d removed from %d", userId, serverId)
		}
	}
}
