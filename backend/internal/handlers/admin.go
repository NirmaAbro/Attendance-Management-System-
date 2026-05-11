package handlers

import (
	"attendance-manager/internal/models"
	"attendance-manager/internal/storage"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func AdminGetStudents(w http.ResponseWriter, r *http.Request) {
	list, err := storage.GetAllStudents()
	if err != nil {
		jsonErr(w, "Failed to fetch students", http.StatusInternalServerError)
		return
	}
	if list == nil { list = []models.Student{} }
	jsonOK(w, "OK", list)
}

func AdminDeleteStudent(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if err := storage.DeleteStudent(id); err != nil {
		jsonErr(w, "Failed to delete student", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Student deleted", nil)
}

func AdminGetAttendance(w http.ResponseWriter, r *http.Request) {
	list, err := storage.GetAllAttendance()
	if err != nil {
		jsonErr(w, "Failed to fetch attendance", http.StatusInternalServerError)
		return
	}
	if list == nil { list = []models.Attendance{} }
	jsonOK(w, "OK", list)
}

func AdminAddAttendance(w http.ResponseWriter, r *http.Request) {
	var req models.AddAttendanceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid body", http.StatusBadRequest)
		return
	}
	if req.StudentID == "" || req.Date == "" || req.Status == "" {
		jsonErr(w, "student_id, date and status are required", http.StatusBadRequest)
		return
	}
	a := models.Attendance{
		StudentID:   req.StudentID,
		StudentName: req.StudentName,
		Date:        req.Date,
		Status:      req.Status,
	}
	id, err := storage.AddAttendance(a)
	if err != nil {
		jsonErr(w, "Failed to add attendance: "+err.Error(), http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Attendance added", map[string]string{"id": id})
}

func AdminUpdateAttendance(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var body struct{ Status string `json:"status"` }
	json.NewDecoder(r.Body).Decode(&body)
	if err := storage.UpdateAttendance(id, body.Status); err != nil {
		jsonErr(w, "Failed to update", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Updated", nil)
}

func AdminDeleteAttendance(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if err := storage.DeleteAttendance(id); err != nil {
		jsonErr(w, "Failed to delete", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Deleted", nil)
}

func AdminGetCorrections(w http.ResponseWriter, r *http.Request) {
	list, err := storage.GetAllCorrections()
	if err != nil {
		jsonErr(w, "Failed to fetch corrections", http.StatusInternalServerError)
		return
	}
	if list == nil { list = []models.CorrectionRequest{} }
	jsonOK(w, "OK", list)
}

func AdminUpdateCorrection(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var body struct{ Status string `json:"status"` }
	json.NewDecoder(r.Body).Decode(&body)
	if err := storage.UpdateCorrectionStatus(id, body.Status); err != nil {
		jsonErr(w, "Failed to update correction", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Correction "+body.Status, nil)
}

func AdminChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	var req models.ChangePasswordRequest
	json.NewDecoder(r.Body).Decode(&req)

	admin, err := storage.GetAdminByID(userID)
	if err != nil || admin == nil {
		jsonErr(w, "Admin not found", http.StatusNotFound)
		return
	}
	if admin.Password != req.OldPassword {
		jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
		return
	}
	if err := storage.UpdateAdminPassword(userID, req.NewPassword); err != nil {
		jsonErr(w, "Failed to update password", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Password updated", nil)
}
