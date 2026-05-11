# 🎓 Attendance Management System
### Next.js + Go (Golang) + MongoDB

---

## ⚡ Quick Start (3 steps)

### Step 1 — Start MongoDB
```bash
# Option A: If MongoDB is installed locally
mongod --dbpath /data/db

# Option B: Use Docker (easiest!)
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Step 2 — Start Backend (Go)
```bash
cd backend
go mod tidy
go run cmd/main.go
```
✅ API runs at **http://localhost:8080**  
✅ Auto-creates database + default admin on first run

### Step 3 — Start Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
✅ App runs at **http://localhost:3000**

---

## 🔑 Default Login

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@gmail.com` | `admin123` |
| Student | Register via UI | Your choice |

> **Note:** The Chrome "Change your password" popup is a Google Password Manager warning about the demo password. Just click **OK** — it does NOT affect the app. The login works fine.

---

## 📁 Project Structure

```
attendance-system/
├── backend/
│   ├── cmd/main.go                      ← Entry point (port 8080)
│   ├── internal/
│   │   ├── models/models.go             ← All data models
│   │   ├── handlers/
│   │   │   ├── handler.go               ← Middleware + session helpers
│   │   │   ├── auth.go                  ← Login, register, logout
│   │   │   ├── admin.go                 ← Admin API handlers
│   │   │   ├── student.go               ← Student API handlers
│   │   │   └── routes.go                ← All API routes
│   │   └── storage/mongo.go             ← MongoDB + in-memory fallback
│   └── go.mod
│
├── frontend/
│   ├── app/
│   │   ├── auth/login/page.tsx          ← Login page
│   │   ├── auth/register/page.tsx       ← Register page
│   │   ├── admin/page.tsx               ← Admin dashboard
│   │   └── student/page.tsx             ← Student dashboard
│   ├── components/Sidebar.tsx           ← Shared sidebar
│   ├── lib/
│   │   ├── api.ts                       ← API client
│   │   └── auth-context.tsx             ← Auth state
│   └── .env.local                       ← API URL config
│
└── database/seed.js                     ← Optional MongoDB seed script
```

---

## 🌐 API Reference

### Auth (Public)
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/register` | `{name, email, password, role}` |
| POST | `/api/login` | `{email, password, role}` |
| POST | `/api/logout` | — |
| GET | `/api/me` | — |

### Admin (requires admin session)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/students` | List students |
| DELETE | `/api/admin/students/:id` | Delete student |
| GET | `/api/admin/attendance` | All attendance |
| POST | `/api/admin/attendance` | Add record |
| PUT | `/api/admin/attendance/:id` | Update status |
| DELETE | `/api/admin/attendance/:id` | Delete record |
| GET | `/api/admin/corrections` | All requests |
| PUT | `/api/admin/corrections/:id` | Approve/Reject |
| PUT | `/api/admin/change-password` | Change password |

### Student (requires student session)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/attendance` | My attendance |
| GET | `/api/student/corrections` | My requests |
| POST | `/api/student/corrections` | Submit request |
| GET | `/api/student/report` | Download CSV |
| PUT | `/api/student/change-password` | Change password |

---

## 🏗️ Architecture

```
Browser (Next.js)
      │  REST API + cookies
      ▼
Go Backend (Gorilla Mux)
  ├── RBAC Middleware (admin / student)
  ├── Cookie Session Auth
  └── MongoDB Driver
        │
        ▼
   MongoDB Atlas / Local
   attendance_db
   ├── admins
   ├── students
   ├── attendance
   └── corrections
```

---

## ⚙️ Environment Variables

**Backend** — set via environment or hardcoded in `cmd/main.go`:
```bash
MONGO_URI=mongodb://localhost:27017   # default
PORT=8080                              # default
```

**Frontend** — `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🛠️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Go | 1.21+ | https://go.dev/dl/ |
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 7+ | https://www.mongodb.com/try/download/community |

**Or use MongoDB Atlas (free cloud):**
1. Create free cluster at https://cloud.mongodb.com
2. Get connection string
3. Set `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net`

---

## 🐛 Troubleshooting

**"Connection error. Is the backend running?"**
→ Run `go run cmd/main.go` in the backend folder

**MongoDB not available**
→ Backend automatically uses **in-memory storage** as fallback — works fine for testing without installing MongoDB

**Port already in use**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill
```

**Chrome "Change your password" popup**
→ Just click OK. It's Chrome's password manager warning — not a bug.
