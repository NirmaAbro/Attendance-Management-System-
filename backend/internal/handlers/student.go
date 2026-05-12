// package handlers

// import (
// 	"attendance-manager/internal/models"
// 	"attendance-manager/internal/storage"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// )

// func StudentGetAttendance(w http.ResponseWriter, r *http.Request) {
// 	userID := sessionUserID(r)
// 	list, err := storage.GetAttendanceByStudentID(userID)
// 	if err != nil {
// 		jsonErr(w, "Failed to fetch attendance", http.StatusInternalServerError)
// 		return
// 	}
// 	if list == nil {
// 		list = []models.Attendance{}
// 	}
// 	jsonOK(w, "OK", list)
// }

// func StudentSubmitCorrection(w http.ResponseWriter, r *http.Request) {
// 	userID := sessionUserID(r)
// 	var req models.SubmitCorrectionRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		jsonErr(w, "Invalid body", http.StatusBadRequest)
// 		return
// 	}
// 	if req.Date == "" || req.Message == "" {
// 		jsonErr(w, "Date and message are required", http.StatusBadRequest)
// 		return
// 	}
// 	c := models.CorrectionRequest{
// 		StudentID: userID, Date: req.Date,
// 		Message: req.Message, Status: "Pending",
// 	}
// 	id, err := storage.AddCorrection(c)
// 	if err != nil {
// 		jsonErr(w, "Failed to submit correction", http.StatusInternalServerError)
// 		return
// 	}
// 	jsonOK(w, "Correction submitted", map[string]string{"id": id})
// }

// func StudentGetCorrections(w http.ResponseWriter, r *http.Request) {
// 	userID := sessionUserID(r)
// 	list, err := storage.GetCorrectionsByStudentID(userID)
// 	if err != nil {
// 		jsonErr(w, "Failed to fetch corrections", http.StatusInternalServerError)
// 		return
// 	}
// 	if list == nil {
// 		list = []models.CorrectionRequest{}
// 	}
// 	jsonOK(w, "OK", list)
// }

// func StudentDownloadReport(w http.ResponseWriter, r *http.Request) {
// 	userID := sessionUserID(r)
// 	sess, _ := store.Get(r, "session")
// 	name, _ := sess.Values["name"].(string)

// 	list, err := storage.GetAttendanceByStudentID(userID)
// 	if err != nil {
// 		jsonErr(w, "Failed to generate report", http.StatusInternalServerError)
// 		return
// 	}
// 	w.Header().Set("Content-Type", "text/csv")
// 	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="attendance_%s.csv"`, name))
// 	fmt.Fprintf(w, "Student ID,Student Name,Date,Status\n")
// 	for _, a := range list {
// 		fmt.Fprintf(w, "%s,%s,%s,%s\n", a.StudentID, a.StudentName, a.Date, a.Status)
// 	}
// }

// func StudentChangePassword(w http.ResponseWriter, r *http.Request) {
// 	userID := sessionUserID(r)
// 	var req models.ChangePasswordRequest
// 	json.NewDecoder(r.Body).Decode(&req)

// 	student, err := storage.GetStudentByID(userID)
// 	if err != nil || student == nil {
// 		jsonErr(w, "Student not found", http.StatusNotFound)
// 		return
// 	}
// 	if student.Password != req.OldPassword {
// 		jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
// 		return
// 	}
// 	if err := storage.UpdateStudentPassword(userID, req.NewPassword); err != nil {
// 		jsonErr(w, "Failed to update password", http.StatusInternalServerError)
// 		return
// 	}
// 	jsonOK(w, "Password updated", nil)
// }

package handlers

import (
	"attendance-manager/internal/models"
	"attendance-manager/internal/storage"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// =====================================================
// CREATE STUDENT
// =====================================================

func CreateStudent(w http.ResponseWriter, r *http.Request) {

	var req models.Student

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		jsonErr(w, "All fields are required", http.StatusBadRequest)
		return
	}

	req.Role = "student"

	id, err := storage.CreateStudent(req)

	if err != nil {
		jsonErr(w, "Failed to create student", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Student created successfully", map[string]string{
		"id": id,
	})
}

// func CreateStudent(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")

// 	var req struct {
// 		Name     string `json:"name"`
// 		Email    string `json:"email"`
// 		Password string `json:"password"`
// 	}

// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		jsonErr(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	// Validation
// 	if req.Name == "" || req.Email == "" || req.Password == "" {
// 		jsonErr(w, "All fields are required", http.StatusBadRequest)
// 		return
// 	}

// 	// Email validation
// 	if !strings.Contains(req.Email, "@") {
// 		jsonErr(w, "Invalid email format", http.StatusBadRequest)
// 		return
// 	}

// 	// Password length validation
// 	if len(req.Password) < 6 {
// 		jsonErr(w, "Password must be at least 6 characters", http.StatusBadRequest)
// 		return
// 	}

// 	// Check duplicate email
// 	existingStudent, _ := storage.GetStudentByEmail(req.Email)

// 	if existingStudent != nil {
// 		jsonErr(w, "Email already exists", http.StatusConflict)
// 		return
// 	}

// 	// Hash password
// 	hashedPassword, err := bcrypt.GenerateFromPassword(
// 		[]byte(req.Password),
// 		bcrypt.DefaultCost,
// 	)

// 	if err != nil {
// 		jsonErr(w, "Failed to hash password", http.StatusInternalServerError)
// 		return
// 	}

// 	student := models.Student{
// 		Name:     req.Name,
// 		Email:    req.Email,
// 		Password: string(hashedPassword),
// 		Role:     "student",
// 	}

// 	id, err := storage.CreateStudent(student)

// 	if err != nil {
// 		jsonErr(w, "Failed to create student", http.StatusInternalServerError)
// 		return
// 	}

// 	jsonOK(w, "Student created successfully", map[string]string{
// 		"id": id,
// 	})
// }

// =====================================================
// GET ALL STUDENTS
// =====================================================
func GetAllStudents(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	students, err := storage.GetAllStudents()

	if err != nil {
		jsonErr(w, "Failed to fetch students", http.StatusInternalServerError)
		return
	}

	if students == nil {
		students = []models.Student{}
	}

	jsonOK(w, "Students fetched successfully", students)
}

// =====================================================
// GET STUDENT BY ID
// =====================================================
func GetStudentByID(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	student, err := storage.GetStudentByID(id)

	if err != nil || student == nil {
		jsonErr(w, "Student not found", http.StatusNotFound)
		return
	}

	jsonOK(w, "Student fetched successfully", student)
}

// =====================================================
// UPDATE STUDENT
// =====================================================

func UpdateStudent(w http.ResponseWriter, r *http.Request) {

	id := mux.Vars(r)["id"]

	var body struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	student, err := storage.UpdateStudent(
		id,
		body.Name,
		body.Email,
	)

	if err != nil {
		jsonErr(w, "Failed to update student", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Student updated successfully", student)
}

// func UpdateStudent(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")

// 	vars := mux.Vars(r)
// 	id := vars["id"]

// 	var req struct {
// 		Name  string `json:"name"`
// 		Email string `json:"email"`
// 	}

// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		jsonErr(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	if req.Name == "" || req.Email == "" {
// 		jsonErr(w, "Name and email are required", http.StatusBadRequest)
// 		return
// 	}

// 	if !strings.Contains(req.Email, "@") {
// 		jsonErr(w, "Invalid email format", http.StatusBadRequest)
// 		return
// 	}

// 	student, err := storage.UpdateStudent(id, req.Name, req.Email)

// 	if err != nil {
// 		jsonErr(w, "Failed to update student", http.StatusInternalServerError)
// 		return
// 	}

// 	jsonOK(w, "Student updated successfully", student)
// }

// =====================================================
// DELETE STUDENT
// =====================================================
func DeleteStudent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	err := storage.DeleteStudent(id)

	if err != nil {
		jsonErr(w, "Failed to delete student", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Student deleted successfully", nil)
}

// =====================================================
// STUDENT GET ATTENDANCE
// =====================================================
// func StudentGetAttendance(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")

// 	userID := sessionUserID(r)

// 	list, err := storage.GetAttendanceByStudentID(userID)

// 	if err != nil {
// 		jsonErr(w, "Failed to fetch attendance", http.StatusInternalServerError)
// 		return
// 	}

// 	if list == nil {
// 		list = []models.Attendance{}
// 	}

// 	jsonOK(w, "Attendance fetched successfully", list)
// }

func StudentGetAttendance(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	// get logged-in student id from session
	userID := sessionUserID(r)

	if userID == "" {
		jsonErr(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// fetch ONLY logged-in student's attendance
	list, err := storage.GetAttendanceByStudentID(userID)

	if err != nil {
		jsonErr(w, "Failed to fetch attendance", http.StatusInternalServerError)
		return
	}

	if list == nil {
		list = []models.Attendance{}
	}

	jsonOK(w, "Attendance fetched successfully", list)
}

// =====================================================
// SUBMIT CORRECTION REQUEST
// =====================================================
func StudentSubmitCorrection(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	userID := sessionUserID(r)

	var req models.SubmitCorrectionRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Date == "" || req.Message == "" {
		jsonErr(w, "Date and message are required", http.StatusBadRequest)
		return
	}

	correction := models.CorrectionRequest{
		StudentID: userID,
		Date:      req.Date,
		Message:   req.Message,
		Status:    "Pending",
	}

	id, err := storage.AddCorrection(correction)

	if err != nil {
		jsonErr(w, "Failed to submit correction", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Correction submitted successfully", map[string]string{
		"id": id,
	})
}

// =====================================================
// GET CORRECTIONS
// =====================================================
func StudentGetCorrections(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	userID := sessionUserID(r)

	list, err := storage.GetCorrectionsByStudentID(userID)

	if err != nil {
		jsonErr(w, "Failed to fetch corrections", http.StatusInternalServerError)
		return
	}

	if list == nil {
		list = []models.CorrectionRequest{}
	}

	jsonOK(w, "Corrections fetched successfully", list)
}

// =====================================================
// DOWNLOAD CSV REPORT
// =====================================================
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
	w.Header().Set(
		"Content-Disposition",
		fmt.Sprintf(`attachment; filename="attendance_%s.csv"`, name),
	)

	fmt.Fprintf(w, "Student ID,Student Name,Date,Status\n")

	for _, a := range list {

		fmt.Fprintf(
			w,
			"%s,%s,%s,%s\n",
			a.StudentID,
			a.StudentName,
			a.Date,
			a.Status,
		)
	}
}

// =====================================================
// CHANGE PASSWORD
// =====================================================
// func StudentChangePassword(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")

// 	userID := sessionUserID(r)

// 	var req models.ChangePasswordRequest

// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		jsonErr(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	if req.OldPassword == "" || req.NewPassword == "" {
// 		jsonErr(w, "Old and new password are required", http.StatusBadRequest)
// 		return
// 	}

// 	if len(req.NewPassword) < 6 {
// 		jsonErr(w, "New password must be at least 6 characters", http.StatusBadRequest)
// 		return
// 	}

// 	student, err := storage.GetStudentByID(userID)

// 	if err != nil || student == nil {
// 		jsonErr(w, "Student not found", http.StatusNotFound)
// 		return
// 	}

// 	// Compare old password
// 	err = bcrypt.CompareHashAndPassword(
// 		[]byte(student.Password),
// 		[]byte(req.OldPassword),
// 	)

// 	if err != nil {
// 		jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
// 		return
// 	}

// 	// Hash new password
// 	hashedPassword, err := bcrypt.GenerateFromPassword(
// 		[]byte(req.NewPassword),
// 		bcrypt.DefaultCost,
// 	)

// 	if err != nil {
// 		jsonErr(w, "Failed to hash password", http.StatusInternalServerError)
// 		return
// 	}

// 	// Update password
// 	err = storage.UpdateStudentPassword(
// 		userID,
// 		string(hashedPassword),
// 	)

// 	if err != nil {
// 		jsonErr(w, "Failed to update password", http.StatusInternalServerError)
// 		return
// 	}

// 	jsonOK(w, "Password updated successfully", nil)
// }

func StudentChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := sessionUserID(r)
	var req models.ChangePasswordRequest
	json.NewDecoder(r.Body).Decode(&req)

	student, err := storage.GetStudentByID(userID)
	if err != nil || student == nil {
		jsonErr(w, "Student not found", http.StatusNotFound)
		return
	}
	// if student.Password != req.OldPassword {
	// 	jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
	// 	return
	// }

	if student.Password != req.OldPassword {

		log.Println("DATABASE PASSWORD:", student.Password)
		log.Println("REQUEST PASSWORD:", req.OldPassword)

		jsonErr(w, "Old password is incorrect", http.StatusUnauthorized)
		return
	}

	if err := storage.UpdateStudentPassword(userID, req.NewPassword); err != nil {
		jsonErr(w, "Failed to update password", http.StatusInternalServerError)
		return
	}
	jsonOK(w, "Password updated", nil)
}

func AdminUpdateStudent(w http.ResponseWriter, r *http.Request) {

	id := mux.Vars(r)["id"]

	var body struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonErr(w, "Invalid body", http.StatusBadRequest)
		return
	}

	updatedStudent, err := storage.UpdateStudent(
		id,
		body.Name,
		body.Email,
	)

	if err != nil {
		jsonErr(w, "Failed to update student", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Student updated successfully", updatedStudent)
}

func AdminCreateStudent(w http.ResponseWriter, r *http.Request) {

	var req models.RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonErr(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		jsonErr(w, "All fields are required", http.StatusBadRequest)
		return
	}

	existing, _ := storage.GetStudentByEmail(req.Email)

	if existing != nil {
		jsonErr(w, "Email already exists", http.StatusConflict)
		return
	}

	id, err := storage.CreateStudent(models.Student{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Role:     "student",
	})

	if err != nil {
		jsonErr(w, "Failed to create student", http.StatusInternalServerError)
		return
	}

	jsonOK(w, "Student created successfully", map[string]string{
		"id": id,
	})
}
