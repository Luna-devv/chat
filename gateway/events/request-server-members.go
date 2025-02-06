package events

import (
	"chat/gateway/clients"
	"chat/gateway/db"
	"fmt"
)

func requestServerMembers(client *clients.Client, data RequestServerMembersEventData) {
	// TODO: chunk, maybe send like chunks with 100-500 members each
	members, err := db.GetServerMembers(data.ServerId)

	if err != nil {
		fmt.Println(err)
		return
	}

	clients.SendToClient(client, ServerMemberChunk{
		ServerId: data.ServerId,
		Members:  members,
	})
}
