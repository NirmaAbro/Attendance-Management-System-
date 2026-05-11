package handlers

import (
	"attendance-manager/internal/models"
	"attendance-manager/internal/storage"
	"encoding/json"
	"net/http"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.Name == "" || req.Email == "" || req.Password == "" || req.Role == "" {
		jsonErr(w, "All fields are required", http.StatusBadRequest)
		return
	}

	if req.Role == "admin" {
		existing, _ := storage.GetAdminByEmail(req.Email)
		if existing != nil {
			jsonErr(w, "Email already registered", http.StatusConflict)
			return
		}
		id, err := storage.CreateAdmin(models.Admin{
			Name: req.Name, Email: req.Email,
			Password: req.Password, Role: "admin",
		})
		if err != nil {
			jsonErr(w, "Registration failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
		jsonOK(w, "Admin registered successfully", map[string]string{"id": id})
	} else {
		existing, _ := storage.GetStudentByEmail(req.Email)
		if existing != nil {
			jsonErr(w, "Email already registered", http.StatusConflict)
			return
		}
		id, err := storage.CreateStudent(models.Student{
			Name: req.Name, Email: req.Email,
			Password: req.Password, Role: "student",
		})
		if err != nil {
			jsonErr(w, "Registration failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
		jsonOK(w, "Student registered successfully", map[string]string{"id": id})
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	sess, _ := store.Get(r, "session")

	if req.Role == "admin" {
		admin, err := storage.GetAdminByEmail(req.Email)
		if err != nil || admin == nil || admin.Password != req.Password {
			jsonErr(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}
		sess.Values["user_id"] = admin.ID.Hex()
		sess.Values["role"] = "admin"
		sess.Values["name"] = admin.Name
		sess.Save(r, w)
		jsonOK(w, "Login successful", map[string]interface{}{
			"role": "admin", "user_id": admin.ID.Hex(), "name": admin.Name,
		})
	} else {
		student, err := storage.GetStudentByEmail(req.Email)
		if err != nil || student == nil || student.Password != req.Password {
			jsonErr(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}
		sess.Values["user_id"] = student.ID.Hex()
		sess.Values["role"] = "student"
		sess.Values["name"] = student.Name
		sess.Save(r, w)
		jsonOK(w, "Login successful", map[string]interface{}{
			"role": "student", "user_id": student.ID.Hex(), "name": student.Name,
		})
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	sess, _ := store.Get(r, "session")
	sess.Options.MaxAge = -1
	sess.Save(r, w)
	jsonOK(w, "Logged out", nil)
}

func GetMe(w http.ResponseWriter, r *http.Request) {
	sess, _ := store.Get(r, "session")
	userID, _ := sess.Values["user_id"].(string)
	role, _   := sess.Values["role"].(string)
	name, _   := sess.Values["name"].(string)
	if userID == "" {
		jsonErr(w, "Not authenticated", http.StatusUnauthorized)
		return
	}
	jsonOK(w, "OK", map[string]string{"user_id": userID, "role": role, "name": name})
}
