package main

import (
	"time"

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

type UserTable struct {
	Id int `json:"id"`

	Email        string `json:"email"`
	PasswordHash string `json:"-"`

	Username string  `json:"username"`
	Nickname *string `json:"nickname"`

	Flags int64 `json:"flags"`

	AvatarId *int `json:"avatar_id"`
	BannerId *int `json:"banner_id"`

	CreatedAt time.Time `json:"created_at"`
}

type ServerTable struct {
	Id int `json:"id"`

	Name string `json:"name"`

	Flags   int64 `json:"flags"`
	OwnerId *int  `json:"owner_id"`

	IconId   *int `json:"icon_id"`
	BannerId *int `json:"banner_id"`

	CreatedAt time.Time `json:"created_at"`
}

type ReadyEventPayload struct {
	User    UserTable     `json:"user"`
	Servers []ServerTable `json:"servers"`
}
