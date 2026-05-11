package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// ── Auth ──────────────────────────────────────────────────────────────────────

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// ── Admin ─────────────────────────────────────────────────────────────────────

type Admin struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name     string             `bson:"name"          json:"name"`
	Email    string             `bson:"email"         json:"email"`
	Password string             `bson:"password"      json:"password,omitempty"`
	Role     string             `bson:"role"          json:"role"`
}

// ── Student ───────────────────────────────────────────────────────────────────

type Student struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name     string             `bson:"name"          json:"name"`
	Email    string             `bson:"email"         json:"email"`
	Password string             `bson:"password"      json:"password,omitempty"`
	Role     string             `bson:"role"          json:"role"`
}

// ── Attendance ────────────────────────────────────────────────────────────────

type Attendance struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudentID   string             `bson:"student_id"    json:"student_id"`
	StudentName string             `bson:"student_name"  json:"student_name"`
	Date        string             `bson:"date"          json:"date"`
	Status      string             `bson:"status"        json:"status"`
}

type AddAttendanceRequest struct {
	StudentID   string `json:"student_id"`
	StudentName string `json:"student_name"`
	Date        string `json:"date"`
	Status      string `json:"status"`
}

// ── Correction ────────────────────────────────────────────────────────────────

type CorrectionRequest struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudentID string             `bson:"student_id"    json:"student_id"`
	Date      string             `bson:"date"          json:"date"`
	Message   string             `bson:"message"       json:"message"`
	Status    string             `bson:"status"        json:"status"`
}

type SubmitCorrectionRequest struct {
	Date    string `json:"date"`
	Message string `json:"message"`
}
