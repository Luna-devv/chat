package jwt

import (
	"chat/gateway/config"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserJWTPayload struct {
	Id string `json:"id"`
	jwt.RegisteredClaims
}

var hash = sha256.Sum256([]byte(config.Get().Secret))
var hexHash = []byte(hex.EncodeToString(hash[:]) + "session")

func Verify(str string) (*UserJWTPayload, error) {
	user := &UserJWTPayload{}

	token, err := jwt.ParseWithClaims(str, user, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return hexHash, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return user, nil
}
