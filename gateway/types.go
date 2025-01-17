package main

import "github.com/gorilla/websocket"

type Client struct {
	Conn     *websocket.Conn
	UserID   string
	GuildIDs map[string]struct{}
}

// Event struct represents a generic event
type Event struct {
	Type string      `json:"t"`
	Data interface{} `json:"d"`
}