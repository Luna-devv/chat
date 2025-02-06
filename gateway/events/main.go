package events

import (
	"chat/gateway/clients"
	"log"

	"github.com/mitchellh/mapstructure"
)

func Handle(client *clients.Client, event Event) {
	switch event.Type {
	}
}
