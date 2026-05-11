package handlers

import (
	"attendance-manager/internal/models"
	"attendance-manager/internal/storage"
	"encoding/json"
	"fmt"
	"net/http"
)

func StudentGetAttendance(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	list, err := storage.GetAttendanceByStudentID(userID)
	if err != nil {
		jsonErr(w, "Failed to fetch attendance", http.StatusInternalServerError)
		return
	}
	if list == nil {
		list = []models.Attendance{}
	}
	jsonOK(w, "OK", list)
}

func StudentSubmitCorrection(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	var req models.SubmitCorrectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid body", http.StatusBadRequest)
		return
	}
	if req.Date == "" || req.Message == "" {
		jsonErr(w, "Date and message are required", http.StatusBadRequest)
		return
	}
	c := models.CorrectionRequest{
		StudentID: userID, Date: req.Date,
		Message: req.Message, Status: "Pending",
	}
	id, err := storage.AddCorrection(c)
	if err != nil {
		jsonErr(w, "Failed to submit correction", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Correction submitted", map[string]string{"id": id})
}

func StudentGetCorrections(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	list, err := storage.GetCorrectionsByStudentID(userID)
	if err != nil {
		jsonErr(w, "Failed to fetch corrections", http.StatusInternalServerError)
		return
	}
	if list == nil {
		list = []models.CorrectionRequest{}
	}
	jsonOK(w, "OK", list)
}

func StudentDownloadReport(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	sess, _ := store.Get(r, "session")
	name, _ := sess.Values["name"].(string)

	list, err := storage.GetAttendanceByStudentID(userID)
	if err != nil {
		jsonErr(w, "Failed to generate report", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="attendance_%s.csv"`, name))
	fmt.Fprintf(w, "Student ID,Student Name,Date,Status\n")
	for _, a := range list {
		fmt.Fprintf(w, "%s,%s,%s,%s\n", a.StudentID, a.StudentName, a.Date, a.Status)
	}
}

func StudentChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	var req models.ChangePasswordRequest
	json.NewDecoder(r.Body).Decode(&req)

	student, err := storage.GetStudentByID(userID)
	if err != nil || student == nil {
		jsonErr(w, "Student not found", http.StatusNotFound)
		return
	}
	if student.Password != req.OldPassword {
		jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
		return
	}
	if err := storage.UpdateStudentPassword(userID, req.NewPassword); err != nil {
		jsonErr(w, "Failed to update password", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Password updated", nil)
}
