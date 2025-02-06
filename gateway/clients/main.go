package clients

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn      *websocket.Conn
	UserId    int
	ServerIds map[int]struct{}
}

var clients = struct {
	sync.RWMutex
	connected map[string]*Client
}{connected: make(map[string]*Client)}

func Add(conId string, client *Client) {
	clients.Lock()
	clients.connected[conId] = client
	clients.Unlock()
}

func Disconnect(conId string) {
	clients.Lock()
	if client, ok := clients.connected[conId]; ok {
		client.Conn.Close()
		delete(clients.connected, conId)
	}
	clients.Unlock()
}
