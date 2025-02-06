package events

import (
	"chat/gateway/db"
)

// outgoing and incommig event
type Event struct {
	Type string      `json:"t"`
	Data interface{} `json:"d"`
}

// outgoing
type ReadyEventPayload struct {
	User               db.UserTable           `json:"user"`
	CurrentUserMembers []db.ServerMemberTable `json:"current_user_members"`
	Servers            []db.ServerTable       `json:"servers"`
	Rooms              []db.RoomTable         `json:"rooms"`
}

type ServerMemberChunk struct {
	ServerId int                    `json:"server_id"`
	Members  []db.ServerMemberTable `json:"members"`
	// chunk_index and chunk_count(?)
}

// incomming
type RequestServerMembersEventData struct {
	ServerId int `json:"server_id"`
}
