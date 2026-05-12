# README.md

````md
# 📚 Web-Based Academic Attendance Tracking System

A modern full-stack Academic Attendance Management System built using **Next.js**, **TypeScript**, **Golang**, and **MongoDB**.

This system allows administrators to manage students, track attendance, analyze attendance performance with charts, approve correction requests, and generate downloadable reports.

---

# 🚀 Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Role-Based Access Control
- Secure Login System
- Protected Routes
- Password Hashing using bcrypt

---

# 👨‍💼 Admin Features

## 📌 Student Management

- Create Student
- Update Student
- Delete Student
- View All Students
- Search Students

---

## 📌 Attendance Management

- Mark Attendance
- Edit Attendance
- Delete Attendance
- Attendance Status (Present / Absent)
- Attendance History

---

## 📊 Analytics Dashboard

### Includes:

- Total Students
- Attendance Rate
- Present Records
- Absent Records

### Charts

- Pie Chart (Present vs Absent)
- Bar Chart (Top Students)
- Line Chart (Attendance Trends)

### Smart Insights

- Top Performing Students
- Low Attendance Students
- Attendance Analytics
- Risk Student Detection

---

## 📩 Correction Requests

Admin can:

- Approve Correction Requests
- Reject Correction Requests
- Manage Attendance Corrections

---

## 📄 Reports Module

- Download Attendance Reports as CSV
- Download Attendance Reports as PDF

---

# 👨‍🎓 Student Features

Students can:

- Login Securely
- View Their Own Attendance Only
- Track Attendance Percentage
- View Attendance History
- Submit Correction Requests

---

# 🛡️ Privacy & Security

- Students cannot access other students’ records
- Admin has full system access
- JWT Middleware protects APIs
- Passwords are securely hashed

---

# 🏗️ System Architecture

The project follows a **Three-Tier Architecture**:

```text
Frontend (Next.js)
        ↓
Backend REST API (Go/Golang)
        ↓
MongoDB Database
````

---

# 🧰 Tech Stack

# Frontend

* Next.js 15
* React.js
* TypeScript
* Tailwind CSS
* Recharts
* Lucide React

---

# Backend

* Golang (Go)
* Gorilla Mux
* JWT Authentication
* bcrypt

---

# Database

* MongoDB

---

# 📦 Libraries Used

## Frontend Packages

```bash
npm install recharts lucide-react
```

Other dependencies:

* next
* react
* react-dom
* typescript
* tailwindcss

---

## Backend Packages

```bash
go get github.com/gorilla/mux
go get github.com/golang-jwt/jwt/v5
go get go.mongodb.org/mongo-driver/mongo
go get golang.org/x/crypto/bcrypt
```

---

# 💻 System Requirements

| Software | Version |
| -------- | ------- |
| Node.js  | v20+    |
| npm      | v10+    |
| Go       | v1.22+  |
| MongoDB  | v7+     |

---

# 📁 Project Structure

```text
attendance-system/
│
├── frontend/                 # Next.js Frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── backend/                  # Golang Backend
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── main.go
│
└── README.md
```

---

# ⚙️ Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/attendance-system.git
```

---

# 2️⃣ Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Run frontend server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# 3️⃣ Backend Setup

## Navigate to backend

```bash
cd backend
```

## Initialize Go modules

```bash
go mod init attendance-backend
```

## Install dependencies

```bash
go mod tidy
```

## Run backend server

```bash
go run main.go
```

Backend will run on:

```bash
http://localhost:8080
```

---

# 4️⃣ MongoDB Setup

## Start MongoDB

```bash
mongod
```

MongoDB runs on:

```bash
mongodb://localhost:27017
```

---

# 🔑 Environment Variables

Create `.env.local` inside frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

Create `.env` inside backend:

```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_secret_key
DB_NAME=attendance_system
```

---

# 📊 Dashboard Tabs

| Tab         | Description                |
| ----------- | -------------------------- |
| Students    | Manage students            |
| Attendance  | Mark & manage attendance   |
| Analytics   | Charts & insights          |
| Reports     | Download reports           |
| Corrections | Approve/reject corrections |

---

# 📈 Analytics Features

## KPI Cards

* Total Students
* Attendance Rate
* Present Records
* Absent Records

---

## Charts

### Pie Chart

Shows:

* Present vs Absent Ratio

### Bar Chart

Shows:

* Top Attendance Students

### Line Chart

Shows:

* Attendance Trends Over Time

---

# 🔄 API Endpoints

# Authentication

| Method | Endpoint |
| ------ | -------- |
| POST   | /login   |

---

# Students

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /students     |
| POST   | /students     |
| PUT    | /students/:id |
| DELETE | /students/:id |

---

# Attendance

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /attendance     |
| POST   | /attendance     |
| PUT    | /attendance/:id |
| DELETE | /attendance/:id |

---

# Corrections

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /corrections     |
| PUT    | /corrections/:id |

---

# 🎨 UI Features

* Modern Glassmorphism Design
* Responsive Dashboard
* Animated Hover Effects
* Modern Tables
* Analytics Charts
* Clean Admin Interface

---

# 📌 Future Improvements

* AI Attendance Prediction
* Face Recognition Attendance
* Dark Mode
* Email Notifications
* SMS Alerts
* Mobile App
* Real-Time Attendance Tracking

---

# 👨‍💻 Author

Developed by:
Your Name

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.

```
```
