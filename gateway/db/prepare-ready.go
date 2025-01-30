package db

import (
	"context"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5/pgxpool"
)

var db, _ = pgxpool.New(context.Background(), "postgres://prod:plschangeme@localhost/chat")

func GetUser(userId int) (UserTable, error) {
	var user UserTable
	err := pgxscan.Get(context.Background(), db, &user, "SELECT * FROM users WHERE id=$1", userId)

	if err != nil {
		return user, err
	}

	return user, nil
}

func GetServersForUser(userId int) ([]ServerTable, error) {
	var servers []ServerTable
	err := pgxscan.Select(context.Background(), db, &servers, "SELECT * FROM servers WHERE owner_id=$1", userId) // TODO: fix

	if err != nil {
		return servers, err
	}

	return servers, nil
}

func GetRoomsByServers(servers []ServerTable) ([]RoomTable, error) {
	var rooms []RoomTable

	var serverIds []int
	for _, server := range servers {
		serverIds = append(serverIds, server.Id)
	}

	if len(serverIds) == 0 {
		return rooms, nil
	}

	err := pgxscan.Select(context.Background(), db, &rooms, "SELECT * FROM rooms WHERE server_id = ANY($1)", serverIds)

	if err != nil {
		return rooms, err
	}

	return rooms, nil
}