// package handlers

// import "github.com/gorilla/mux"

// func RegisterRoutes(r *mux.Router) {
// 	api := r.PathPrefix("/api").Subrouter()

// 	// Public
// 	api.HandleFunc("/register", Register).Methods("POST", "OPTIONS")
// 	api.HandleFunc("/login",    Login).Methods("POST", "OPTIONS")
// 	api.HandleFunc("/logout",   Logout).Methods("POST", "OPTIONS")
// 	api.HandleFunc("/me",       RequireAuth(GetMe)).Methods("GET", "OPTIONS")

// 	// Admin
// 	api.HandleFunc("/admin/students",          RequireAdmin(AdminGetStudents)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/admin/students/{id}",     RequireAdmin(AdminDeleteStudent)).Methods("DELETE", "OPTIONS")
// 	api.HandleFunc("/admin/attendance",        RequireAdmin(AdminGetAttendance)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/admin/attendance",        RequireAdmin(AdminAddAttendance)).Methods("POST", "OPTIONS")
// 	api.HandleFunc("/admin/attendance/{id}",   RequireAdmin(AdminUpdateAttendance)).Methods("PUT", "OPTIONS")
// 	api.HandleFunc("/admin/attendance/{id}",   RequireAdmin(AdminDeleteAttendance)).Methods("DELETE", "OPTIONS")
// 	api.HandleFunc("/admin/corrections",       RequireAdmin(AdminGetCorrections)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/admin/corrections/{id}",  RequireAdmin(AdminUpdateCorrection)).Methods("PUT", "OPTIONS")
// 	api.HandleFunc("/admin/change-password",   RequireAdmin(AdminChangePassword)).Methods("PUT", "OPTIONS")

// 	// Student
// 	api.HandleFunc("/student/attendance",      RequireStudent(StudentGetAttendance)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/student/corrections",     RequireStudent(StudentGetCorrections)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/student/corrections",     RequireStudent(StudentSubmitCorrection)).Methods("POST", "OPTIONS")
// 	api.HandleFunc("/student/report",          RequireStudent(StudentDownloadReport)).Methods("GET", "OPTIONS")
// 	api.HandleFunc("/student/change-password", RequireStudent(StudentChangePassword)).Methods("PUT", "OPTIONS")
// }

package handlers

import "github.com/gorilla/mux"

func RegisterRoutes(r *mux.Router) {

	api := r.PathPrefix("/api").Subrouter()

	// =====================================================
	// PUBLIC ROUTES
	// =====================================================

	api.HandleFunc("/register", Register).Methods("POST", "OPTIONS")
	api.HandleFunc("/login", Login).Methods("POST", "OPTIONS")
	api.HandleFunc("/logout", Logout).Methods("POST", "OPTIONS")

	api.HandleFunc(
		"/me",
		RequireAuth(GetMe),
	).Methods("GET", "OPTIONS")

	// =====================================================
	// ADMIN ROUTES
	// =====================================================

	// ---------- STUDENT MANAGEMENT ----------

	api.HandleFunc(
		"/admin/students",
		// RequireAdmin(GetAllStudents),
		GetAllStudents,
	).Methods("GET", "OPTIONS")

	api.HandleFunc(
		"/admin/students",
		// RequireAdmin(CreateStudent),
		CreateStudent,
	).Methods("POST", "OPTIONS")

	api.HandleFunc(
		"/admin/students/{id}",
		// RequireAdmin(GetStudentByID),
		GetStudentByID,
	).Methods("GET", "OPTIONS")

	api.HandleFunc(
		"/admin/students/{id}",
		// RequireAdmin(UpdateStudent),
		UpdateStudent,
	).Methods("PUT", "OPTIONS")

	api.HandleFunc(
		"/admin/students/{id}",
		// RequireAdmin(DeleteStudent),
		DeleteStudent,
	).Methods("DELETE", "OPTIONS")

	// ---------- ATTENDANCE MANAGEMENT ----------

	api.HandleFunc(
		"/admin/attendance",
		// RequireAdmin(AdminGetAttendance),
		AdminGetAttendance,
	).Methods("GET", "OPTIONS")

	api.HandleFunc(
		"/admin/attendance",
		// RequireAdmin(AdminAddAttendance),
		AdminAddAttendance,
	).Methods("POST", "OPTIONS")

	api.HandleFunc(
		"/admin/attendance/{id}",
		// RequireAdmin(AdminUpdateAttendance),
		AdminUpdateAttendance,
	).Methods("PUT", "OPTIONS")

	api.HandleFunc(
		"/admin/attendance/{id}",
		// RequireAdmin(AdminDeleteAttendance),
		AdminDeleteAttendance,
	).Methods("DELETE", "OPTIONS")

	// ---------- CORRECTION REQUESTS ----------

	api.HandleFunc(
		"/admin/corrections",
		// RequireAdmin(AdminGetCorrections),
		AdminGetCorrections,
	).Methods("GET", "OPTIONS")

	api.HandleFunc(
		"/admin/corrections/{id}",
		// RequireAdmin(AdminUpdateCorrection),
		AdminUpdateCorrection,
	).Methods("PUT", "OPTIONS")

	// ---------- ADMIN PASSWORD ----------

	api.HandleFunc(
		"/admin/change-password",
		// RequireAdmin(AdminChangePassword),
		AdminChangePassword,
	).Methods("PUT", "OPTIONS")

	// =====================================================
	// STUDENT ROUTES
	// =====================================================

	// ---------- STUDENT ATTENDANCE ----------

	api.HandleFunc(
		"/student/attendance",
		// RequireStudent(StudentGetAttendance),
		StudentGetAttendance,
	).Methods("GET", "OPTIONS")

	// ---------- STUDENT CORRECTIONS ----------

	api.HandleFunc(
		"/student/corrections",
		// RequireStudent(StudentGetCorrections),
		StudentGetCorrections,
	).Methods("GET", "OPTIONS")

	api.HandleFunc(
		"/student/corrections",
		// RequireStudent(StudentSubmitCorrection),
		StudentSubmitCorrection,
	).Methods("POST", "OPTIONS")

	// ---------- STUDENT REPORT ----------

	api.HandleFunc(
		"/student/report",
		// RequireStudent(StudentDownloadReport),
		StudentDownloadReport,
	).Methods("GET", "OPTIONS")

	// ---------- STUDENT PASSWORD ----------

	api.HandleFunc(
		"/student/change-password",
		// RequireStudent(StudentChangePassword),
		StudentChangePassword,
	).Methods("PUT", "OPTIONS")

	// Student sees ONLY own attendance
	api.HandleFunc(
		"/student/attendance",
		StudentGetAttendance,
	).Methods("GET", "OPTIONS")
}
