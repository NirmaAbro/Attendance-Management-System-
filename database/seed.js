// Run this in MongoDB Shell (mongosh) OR MongoDB Compass
// Just paste and run — the Go backend also auto-creates everything on startup

use attendance_db

// The backend seeds a default admin automatically on first run.
// You can also manually seed here:

db.admins.insertOne({
  name: "Admin",
  email: "admin@gmail.com",
  password: "admin123",
  role: "admin"
})

// Sample students (optional)
db.students.insertMany([
  { name: "Hussna",   email: "hussna@gmail.com",   password: "pass1234", role: "student" },
  { name: "Mohammad", email: "mohammad@gmail.com", password: "pass1234", role: "student" },
  { name: "Afroza",   email: "afroza@gmail.com",   password: "pass1234", role: "student" },
])

// Sample attendance (optional)
db.attendance.insertMany([
  { student_id: "hussna001",   student_name: "Hussna",   date: "2026-01-25", status: "Absent"  },
  { student_id: "mohammad001", student_name: "Mohammad", date: "2026-01-24", status: "Present" },
  { student_id: "afroza001",   student_name: "Afroza",   date: "2026-01-26", status: "Absent"  },
])

print("MongoDB seeded successfully!")
