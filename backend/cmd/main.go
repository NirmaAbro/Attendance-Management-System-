package main

import (
	"attendance-manager/internal/handlers"
	"attendance-manager/internal/storage"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	storage.Connect(mongoURI)

	r := mux.NewRouter()
	handlers.RegisterRoutes(r)

	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","db":"mongodb"}`))
	}).Methods("GET")

	allowedOrigins := []string{
		"http://localhost:3000",
		"http://localhost:3001",
		"http://127.0.0.1:3000",
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Cookie"},
		AllowCredentials: true,
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🎓 Attendance Manager API → http://localhost:%s", port)
	log.Printf("📦 MongoDB URI: %s", mongoURI)
	if err := http.ListenAndServe(":"+port, c.Handler(r)); err != nil {
		log.Fatal(err)
	}
}
