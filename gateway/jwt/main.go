package jwt

import (
	"net/http"
)

func ExtractSessionTokenFromRequest(r *http.Request) string {
	cookie, err := r.Cookie("session")

	if err == nil && len(cookie.Value) != 0 {
		return cookie.Value
	}

	return r.URL.Query().Get("session")
}
