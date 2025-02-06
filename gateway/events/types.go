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
