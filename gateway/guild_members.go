package main

import "log"

func addMemberToGuild(guildID, userID string) {
	clients.Lock()
	if client, ok := clients.connected[userID]; ok {
		client.GuildIDs[guildID] = struct{}{}
		log.Printf("User %s added to guild %s", userID, guildID)
	}
	clients.Unlock()
}

func removeMemberFromGuild(guildID, userID string) {
	clients.Lock()
	if client, ok := clients.connected[userID]; ok {
		delete(client.GuildIDs, guildID)
		log.Printf("User %s removed from guild %s", userID, guildID)
	}
	clients.Unlock()
}