package db

import "time"

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

type RoomTable struct {
	Id int `json:"id"`

	Name string `json:"name"`

	Type   int `json:"type"`
	Flags   int64 `json:"flags"`
	Position int  `json:"position"`

	ServerId   int `json:"server_id"`
	ParentRoomId *int `json:"parent_room_id"`

	CreatedAt time.Time `json:"created_at"`
}

type ServerMemberTable struct {
	ServerId   int `json:"server_id"`
	UserId   int `json:"user_id"`

	JoinedAt time.Time `json:"joined_at"`
}