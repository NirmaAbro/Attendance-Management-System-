package handlers

import (
	"attendance-manager/internal/models"
	"encoding/json"
	"net/http"

	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte("attendance-secret-key-2024-mongo"))

func init() {
	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	}
}

func jsonErr(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(models.APIResponse{Success: false, Message: msg})
}

func jsonOK(w http.ResponseWriter, msg string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.APIResponse{Success: true, Message: msg, Data: data})
}

func sessionUserID(r *http.Request) string {
	sess, _ := store.Get(r, "session")
	id, _ := sess.Values["user_id"].(string)
	return id
}

func sessionRole(r *http.Request) string {
	sess, _ := store.Get(r, "session")
	role, _ := sess.Values["role"].(string)
	return role
}

// ── Middleware ────────────────────────────────────────────────────────────────

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if sessionUserID(r) == "" {
			jsonErr(w, "Authentication required", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

func RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if sessionUserID(r) == "" {
			jsonErr(w, "Authentication required", http.StatusUnauthorized)
			return
		}
		if sessionRole(r) != "admin" {
			jsonErr(w, "Admin access required", http.StatusForbidden)
			return
		}
		next(w, r)
	}
}

func RequireStudent(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if sessionUserID(r) == "" {
			jsonErr(w, "Authentication required", http.StatusUnauthorized)
			return
		}
		if sessionRole(r) != "student" {
			jsonErr(w, "Student access required", http.StatusForbidden)
			return
		}
		next(w, r)
	}
}
