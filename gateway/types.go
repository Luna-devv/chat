package main

import (
	"chat/gateway/db"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn      *websocket.Conn
	UserId    int
	ServerIds map[int]struct{}
}

// Event struct represents a generic event
type Event struct {
	Type string      `json:"t"`
	Data interface{} `json:"d"`
}

type ReadyEventPayload struct {
	User               db.UserTable           `json:"user"`
	CurrentUserMembers []db.ServerMemberTable `json:"current_user_members"`
	Servers            []db.ServerTable       `json:"servers"`
	Rooms              []db.RoomTable         `json:"rooms"`
}
