package storage

import (
	"attendance-manager/internal/models"
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client    *mongo.Client
	db        *mongo.Database
	useMemory bool

	// collections
	adminCol      *mongo.Collection
	studentCol    *mongo.Collection
	attendanceCol *mongo.Collection
	correctionCol *mongo.Collection
)

// ── Connect ───────────────────────────────────────────────────────────────────

func Connect(uri string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Printf("MongoDB connect error: %v — using in-memory storage", err)
		useMemory = true
		seedMemory()
		return
	}

	if err = client.Ping(ctx, nil); err != nil {
		log.Printf("MongoDB ping failed: %v — using in-memory storage", err)
		useMemory = true
		seedMemory()
		return
	}

	db = client.Database("attendance_db")
	adminCol = db.Collection("admins")
	studentCol = db.Collection("students")
	attendanceCol = db.Collection("attendance")
	correctionCol = db.Collection("corrections")

	// Unique indexes
	adminCol.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	studentCol.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	// Seed default admin if none exists
	count, _ := adminCol.CountDocuments(ctx, bson.M{})
	if count == 0 {
		adminCol.InsertOne(ctx, models.Admin{
			Name: "Admin", Email: "admin@gmail.com",
			Password: "admin123", Role: "admin",
		})
		log.Println("Default admin seeded: admin@gmail.com / admin123")
	}

	log.Println("✅ Connected to MongoDB")
}

func ctx() context.Context {
	c, _ := context.WithTimeout(context.Background(), 5*time.Second)
	return c
}

// ── In-Memory Fallback ────────────────────────────────────────────────────────

var (
	memAdmins      []models.Admin
	memStudents    []models.Student
	memAttendance  []models.Attendance
	memCorrections []models.CorrectionRequest
)

func seedMemory() {
	memAdmins = []models.Admin{{
		ID: primitive.NewObjectID(), Name: "Admin",
		Email: "admin@gmail.com", Password: "admin123", Role: "admin",
	}}
	log.Println("In-memory storage seeded. Default admin: admin@gmail.com / admin123")
}

// ── Admin Repository ──────────────────────────────────────────────────────────

func GetAdminByEmail(email string) (*models.Admin, error) {
	if useMemory {
		for _, a := range memAdmins {
			if a.Email == email {
				return &a, nil
			}
		}
		return nil, nil
	}
	var a models.Admin
	err := adminCol.FindOne(ctx(), bson.M{"email": email}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &a, err
}

func GetAdminByID(id string) (*models.Admin, error) {
	if useMemory {
		for _, a := range memAdmins {
			if a.ID.Hex() == id {
				return &a, nil
			}
		}
		return nil, nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	var a models.Admin
	err := adminCol.FindOne(ctx(), bson.M{"_id": oid}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &a, err
}

func CreateAdmin(a models.Admin) (string, error) {
	if useMemory {
		for _, ex := range memAdmins {
			if ex.Email == a.Email {
				return "", mongo.ErrNoDocuments
			}
		}
		a.ID = primitive.NewObjectID()
		memAdmins = append(memAdmins, a)
		return a.ID.Hex(), nil
	}
	a.ID = primitive.NewObjectID()
	_, err := adminCol.InsertOne(ctx(), a)
	return a.ID.Hex(), err
}

func UpdateAdminPassword(id, newPassword string) error {
	if useMemory {
		for i, a := range memAdmins {
			if a.ID.Hex() == id {
				memAdmins[i].Password = newPassword
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	_, err := adminCol.UpdateOne(ctx(), bson.M{"_id": oid}, bson.M{"$set": bson.M{"password": newPassword}})
	return err
}

// ── Student Repository ────────────────────────────────────────────────────────

func GetStudentByEmail(email string) (*models.Student, error) {
	if useMemory {
		for _, s := range memStudents {
			if s.Email == email {
				return &s, nil
			}
		}
		return nil, nil
	}
	var s models.Student
	err := studentCol.FindOne(ctx(), bson.M{"email": email}).Decode(&s)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &s, err
}

func GetStudentByID(id string) (*models.Student, error) {
	if useMemory {
		for _, s := range memStudents {
			if s.ID.Hex() == id {
				return &s, nil
			}
		}
		return nil, nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	var s models.Student
	err := studentCol.FindOne(ctx(), bson.M{"_id": oid}).Decode(&s)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &s, err
}

func CreateStudent(s models.Student) (string, error) {
	if useMemory {
		for _, ex := range memStudents {
			if ex.Email == s.Email {
				return "", mongo.ErrNoDocuments
			}
		}
		s.ID = primitive.NewObjectID()
		memStudents = append(memStudents, s)
		return s.ID.Hex(), nil
	}
	s.ID = primitive.NewObjectID()
	_, err := studentCol.InsertOne(ctx(), s)
	return s.ID.Hex(), err
}

func UpdateStudent(id, name, email string) (*models.Student, error) {

	// In-memory update
	if useMemory {
		for i, s := range memStudents {

			if s.ID.Hex() == id {

				memStudents[i].Name = name
				memStudents[i].Email = email

				return &memStudents[i], nil
			}
		}

		return nil, mongo.ErrNoDocuments
	}

	// MongoDB update
	oid, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, err
	}

	update := bson.M{
		"$set": bson.M{
			"name":  name,
			"email": email,
		},
	}

	_, err = studentCol.UpdateOne(
		ctx(),
		bson.M{"_id": oid},
		update,
	)

	if err != nil {
		return nil, err
	}

	// Return updated student
	var updatedStudent models.Student

	err = studentCol.FindOne(
		ctx(),
		bson.M{"_id": oid},
	).Decode(&updatedStudent)

	if err != nil {
		return nil, err
	}

	return &updatedStudent, nil
}

func GetAllStudents() ([]models.Student, error) {
	if useMemory {
		return memStudents, nil
	}
	cursor, err := studentCol.Find(ctx(), bson.M{})
	if err != nil {
		return nil, err
	}
	var list []models.Student
	cursor.All(ctx(), &list)
	return list, nil
}

func DeleteStudent(id string) error {
	if useMemory {
		for i, s := range memStudents {
			if s.ID.Hex() == id {
				memStudents = append(memStudents[:i], memStudents[i+1:]...)
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	attendanceCol.DeleteMany(ctx(), bson.M{"student_id": id})
	correctionCol.DeleteMany(ctx(), bson.M{"student_id": id})
	_, err := studentCol.DeleteOne(ctx(), bson.M{"_id": oid})
	return err
}

func UpdateStudentPassword(id, newPassword string) error {
	if useMemory {
		for i, s := range memStudents {
			if s.ID.Hex() == id {
				memStudents[i].Password = newPassword
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	_, err := studentCol.UpdateOne(ctx(), bson.M{"_id": oid}, bson.M{"$set": bson.M{"password": newPassword}})
	return err
}

// ── Attendance Repository ─────────────────────────────────────────────────────

func GetAllAttendance() ([]models.Attendance, error) {
	if useMemory {
		return memAttendance, nil
	}
	cursor, err := attendanceCol.Find(ctx(), bson.M{}, options.Find().SetSort(bson.D{{Key: "date", Value: -1}}))
	if err != nil {
		return nil, err
	}
	var list []models.Attendance
	cursor.All(ctx(), &list)
	return list, nil
}

func GetAttendanceByStudentID(studentID string) ([]models.Attendance, error) {
	if useMemory {
		var result []models.Attendance
		for _, a := range memAttendance {
			if a.StudentID == studentID {
				result = append(result, a)
			}
		}
		return result, nil
	}
	cursor, err := attendanceCol.Find(ctx(), bson.M{"student_id": studentID}, options.Find().SetSort(bson.D{{Key: "date", Value: -1}}))
	if err != nil {
		return nil, err
	}
	var list []models.Attendance
	cursor.All(ctx(), &list)
	return list, nil
}

func AddAttendance(a models.Attendance) (string, error) {
	if useMemory {
		a.ID = primitive.NewObjectID()
		memAttendance = append(memAttendance, a)
		return a.ID.Hex(), nil
	}
	a.ID = primitive.NewObjectID()
	_, err := attendanceCol.InsertOne(ctx(), a)
	return a.ID.Hex(), err
}

func UpdateAttendance(id, status string) error {
	if useMemory {
		for i, a := range memAttendance {
			if a.ID.Hex() == id {
				memAttendance[i].Status = status
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	_, err := attendanceCol.UpdateOne(ctx(), bson.M{"_id": oid}, bson.M{"$set": bson.M{"status": status}})
	return err
}

func DeleteAttendance(id string) error {
	if useMemory {
		for i, a := range memAttendance {
			if a.ID.Hex() == id {
				memAttendance = append(memAttendance[:i], memAttendance[i+1:]...)
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	_, err := attendanceCol.DeleteOne(ctx(), bson.M{"_id": oid})
	return err
}

// ── Correction Repository ─────────────────────────────────────────────────────

func GetAllCorrections() ([]models.CorrectionRequest, error) {
	if useMemory {
		return memCorrections, nil
	}
	cursor, err := correctionCol.Find(ctx(), bson.M{}, options.Find().SetSort(bson.D{{Key: "_id", Value: -1}}))
	if err != nil {
		return nil, err
	}
	var list []models.CorrectionRequest
	cursor.All(ctx(), &list)
	return list, nil
}

func GetCorrectionsByStudentID(studentID string) ([]models.CorrectionRequest, error) {
	if useMemory {
		var result []models.CorrectionRequest
		for _, c := range memCorrections {
			if c.StudentID == studentID {
				result = append(result, c)
			}
		}
		return result, nil
	}
	cursor, err := correctionCol.Find(ctx(), bson.M{"student_id": studentID}, options.Find().SetSort(bson.D{{Key: "_id", Value: -1}}))
	if err != nil {
		return nil, err
	}
	var list []models.CorrectionRequest
	cursor.All(ctx(), &list)
	return list, nil
}

func AddCorrection(c models.CorrectionRequest) (string, error) {
	if useMemory {
		c.ID = primitive.NewObjectID()
		c.Status = "Pending"
		memCorrections = append(memCorrections, c)
		return c.ID.Hex(), nil
	}
	c.ID = primitive.NewObjectID()
	c.Status = "Pending"
	_, err := correctionCol.InsertOne(ctx(), c)
	return c.ID.Hex(), err
}

func UpdateCorrectionStatus(id, status string) error {
	if useMemory {
		for i, c := range memCorrections {
			if c.ID.Hex() == id {
				memCorrections[i].Status = status
				return nil
			}
		}
		return nil
	}
	oid, _ := primitive.ObjectIDFromHex(id)
	_, err := correctionCol.UpdateOne(ctx(), bson.M{"_id": oid}, bson.M{"$set": bson.M{"status": status}})
	return err
}
