package models

import (
	"errors"
	"time"

	"github.com/smhnaqvi/cvilo/database"
	"gorm.io/gorm"
)

type ResumeModel struct {
	gorm.Model
	UserID uint      `json:"user_id" gorm:"not null"`
	User   UserModel `json:"user" gorm:"foreignKey:UserID"`

	// Resume metadata
	Title    string `json:"title" gorm:"not null"`
	IsActive bool   `json:"is_active" gorm:"default:true"`

	// Personal Information
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Website  string `json:"website"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`

	// Professional Summary
	Summary   string `json:"summary"`
	Objective string `json:"objective"`

	// Experience (JSON array as string for simplicity)
	Experience string `json:"experience"` // JSON string of WorkExperience array

	// Education (JSON array as string)
	Education string `json:"education"` // JSON string of Education array

	// Skills (JSON array as string)
	Skills string `json:"skills"` // JSON string of skills array

	// Additional sections
	Languages      string `json:"languages"`
	Certifications string `json:"certifications"`
	Projects       string `json:"projects"`
	Awards         string `json:"awards"`
	Interests      string `json:"interests"`
	References     string `json:"references"`

	// Template and styling
	Template string `json:"template" gorm:"default:'modern'"`
	Theme    string `json:"theme" gorm:"default:'blue'"`
}

// TableName overrides the table name used by Resume to `resumes`
func (ResumeModel) TableName() string {
	return "resumes"
}

// Separate structs for JSON marshaling/unmarshaling
type WorkExperience struct {
	Company      string     `json:"company"`
	Position     string     `json:"position"`
	Location     string     `json:"location"`
	StartDate    time.Time  `json:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty"` // nil for current job
	IsCurrent    bool       `json:"is_current"`
	Description  string     `json:"description"`
	Technologies []string   `json:"technologies,omitempty"`
}

type Education struct {
	Institution  string     `json:"institution"`
	Degree       string     `json:"degree"`
	FieldOfStudy string     `json:"field_of_study"`
	Location     string     `json:"location"`
	StartDate    time.Time  `json:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	GPA          string     `json:"gpa,omitempty"`
	Description  string     `json:"description,omitempty"`
}

type Skill struct {
	Name     string `json:"name"`
	Category string `json:"category"` // e.g., "Technical", "Languages", "Soft Skills"
	Level    int    `json:"level"`    // 1-5 proficiency level
	YearsExp int    `json:"years_experience,omitempty"`
}

type Language struct {
	Name        string `json:"name"`
	Proficiency string `json:"proficiency"` // e.g., "Native", "Fluent", "Conversational"
}

type Certification struct {
	Name         string     `json:"name"`
	Issuer       string     `json:"issuer"`
	IssueDate    time.Time  `json:"issue_date"`
	ExpiryDate   *time.Time `json:"expiry_date,omitempty"`
	CredentialID string     `json:"credential_id,omitempty"`
	URL          string     `json:"url,omitempty"`
}

type Project struct {
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	Technologies []string   `json:"technologies"`
	StartDate    time.Time  `json:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	URL          string     `json:"url,omitempty"`
	GitHub       string     `json:"github,omitempty"`
}

func (r *ResumeModel) Create() error {
	db := database.GetSqliteDB()
	if err := db.Create(&r).Error; err != nil {
		return err
	}

	// Load the user relationship
	db.Preload("User").First(&r, r.ID)

	return nil
}

func (r *ResumeModel) GetResumeByID(id uint) error {
	db := database.GetSqliteDB()
	if err := db.First(&r, id).Error; err == nil {
		return nil
	}
	return errors.New("resume not found")
}

func (r *ResumeModel) GetResumesByUserID(userID uint) ([]ResumeModel, error) {
	db := database.GetSqliteDB()
	var resumes []ResumeModel
	if err := db.Where("user_id = ?", userID).Preload("User").Find(&resumes).Error; err == nil {
		return resumes, nil
	}
	return nil, errors.New("resumes not found")
}

func (r *ResumeModel) GetAllResumes(offset int, limit int) ([]ResumeModel, int64, error) {
	db := database.GetSqliteDB()
	var resumes []ResumeModel
	var total int64
	db.Model(&ResumeModel{}).Count(&total)
	if err := db.Limit(limit).Offset(offset).Preload("User").Find(&resumes).Error; err == nil {
		return resumes, total, nil
	}
	return nil, 0, errors.New("resumes not found")
}

func (r *ResumeModel) UpdateResume(id uint, updateData ResumeModel) error {
	db := database.GetSqliteDB()
	if err := db.Model(&r).Updates(updateData).Error; err != nil {
		return err
	}

	// Load the user relationship
	db.Preload("User").First(&r, r.ID)
	return nil
}

func (r *ResumeModel) DeleteResume(id uint) error {
	db := database.GetSqliteDB()
	if err := db.Delete(&r, id).Error; err != nil {
		return err
	}
	return nil
}
