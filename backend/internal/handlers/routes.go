package handlers

import "github.com/gorilla/mux"

func RegisterRoutes(r *mux.Router) {
	api := r.PathPrefix("/api").Subrouter()

	// Public
	api.HandleFunc("/register", Register).Methods("POST", "OPTIONS")
	api.HandleFunc("/login",    Login).Methods("POST", "OPTIONS")
	api.HandleFunc("/logout",   Logout).Methods("POST", "OPTIONS")
	api.HandleFunc("/me",       RequireAuth(GetMe)).Methods("GET", "OPTIONS")

	// Admin
	api.HandleFunc("/admin/students",          RequireAdmin(AdminGetStudents)).Methods("GET", "OPTIONS")
	api.HandleFunc("/admin/students/{id}",     RequireAdmin(AdminDeleteStudent)).Methods("DELETE", "OPTIONS")
	api.HandleFunc("/admin/attendance",        RequireAdmin(AdminGetAttendance)).Methods("GET", "OPTIONS")
	api.HandleFunc("/admin/attendance",        RequireAdmin(AdminAddAttendance)).Methods("POST", "OPTIONS")
	api.HandleFunc("/admin/attendance/{id}",   RequireAdmin(AdminUpdateAttendance)).Methods("PUT", "OPTIONS")
	api.HandleFunc("/admin/attendance/{id}",   RequireAdmin(AdminDeleteAttendance)).Methods("DELETE", "OPTIONS")
	api.HandleFunc("/admin/corrections",       RequireAdmin(AdminGetCorrections)).Methods("GET", "OPTIONS")
	api.HandleFunc("/admin/corrections/{id}",  RequireAdmin(AdminUpdateCorrection)).Methods("PUT", "OPTIONS")
	api.HandleFunc("/admin/change-password",   RequireAdmin(AdminChangePassword)).Methods("PUT", "OPTIONS")

	// Student
	api.HandleFunc("/student/attendance",      RequireStudent(StudentGetAttendance)).Methods("GET", "OPTIONS")
	api.HandleFunc("/student/corrections",     RequireStudent(StudentGetCorrections)).Methods("GET", "OPTIONS")
	api.HandleFunc("/student/corrections",     RequireStudent(StudentSubmitCorrection)).Methods("POST", "OPTIONS")
	api.HandleFunc("/student/report",          RequireStudent(StudentDownloadReport)).Methods("GET", "OPTIONS")
	api.HandleFunc("/student/change-password", RequireStudent(StudentChangePassword)).Methods("PUT", "OPTIONS")
}
