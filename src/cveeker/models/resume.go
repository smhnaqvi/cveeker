package models

import (
	"time"

	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	UserID uint `json:"user_id" gorm:"not null"`
	User   User `json:"user" gorm:"foreignKey:UserID"`

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
