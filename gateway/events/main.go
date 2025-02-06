package events

import (
	"chat/gateway/clients"
	"log"

	"github.com/mitchellh/mapstructure"
)

func Handle(client *clients.Client, event Event) {
	switch event.Type {
	case "request_server_members":
		var data RequestServerMembersEventData
		if err := mapstructure.Decode(event.Data, &data); err != nil {
			log.Println("Invalid event data, ignoring:", err)
			return
		}

		requestServerMembers(client, data)
	}
}
