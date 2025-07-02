package models

import (
	"time"

	"github.com/smhnaqvi/cvilo/database"
	"gorm.io/gorm"
)

// LinkedInAuthModel represents LinkedIn OAuth tokens and user data
type LinkedInAuthModel struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	UserID       uint      `json:"user_id" gorm:"uniqueIndex;not null"`
	LinkedInID   string    `json:"linkedin_id" gorm:"uniqueIndex;not null"`
	AccessToken  string    `json:"access_token" gorm:"type:text;not null"`
	RefreshToken string    `json:"refresh_token" gorm:"type:text"`
	TokenExpiry  time.Time `json:"token_expiry"`
	ProfileURL   string    `json:"profile_url"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`

	// Relationships
	User UserModel `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// LinkedInProfileData represents the complete LinkedIn profile data
type LinkedInProfileData struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	UserID uint `json:"user_id" gorm:"uniqueIndex;not null"`

	// Basic Profile Information
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Headline     string `json:"headline"`
	Summary      string `json:"summary" gorm:"type:text"`
	Location     string `json:"location"`
	Industry     string `json:"industry"`
	ProfileURL   string `json:"profile_url"`
	ProfileImage string `json:"profile_image"`

	// Contact Information
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Website     string `json:"website"`
	LinkedInURL string `json:"linkedin_url"`

	// Professional Information
	CurrentPosition string `json:"current_position"`
	Company         string `json:"company"`
	Experience      string `json:"experience" gorm:"type:text"`     // JSON array of experiences
	Education       string `json:"education" gorm:"type:text"`      // JSON array of education
	Skills          string `json:"skills" gorm:"type:text"`         // JSON array of skills
	Certifications  string `json:"certifications" gorm:"type:text"` // JSON array of certifications
	Languages       string `json:"languages" gorm:"type:text"`      // JSON array of languages

	// Additional Information
	VolunteerExperience string `json:"volunteer_experience" gorm:"type:text"` // JSON array
	Publications        string `json:"publications" gorm:"type:text"`         // JSON array
	Projects            string `json:"projects" gorm:"type:text"`             // JSON array
	Honors              string `json:"honors" gorm:"type:text"`               // JSON array
	Organizations       string `json:"organizations" gorm:"type:text"`        // JSON array

	// System Fields
	LastSynced time.Time `json:"last_synced"`
	IsActive   bool      `json:"is_active" gorm:"default:true"`

	// Relationships
	User UserModel `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// LinkedInAuthRequest represents the request structure for LinkedIn authentication
type LinkedInAuthRequest struct {
	Code  string `json:"code" validate:"required"`
	State string `json:"state,omitempty"`
}

// LinkedInAuthResponse represents the response structure for LinkedIn authentication
type LinkedInAuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
}

// LinkedInProfileResponse represents the LinkedIn profile API response
type LinkedInProfileResponse struct {
	ID             string `json:"id"`
	FirstName      string `json:"localizedFirstName"`
	LastName       string `json:"localizedLastName"`
	ProfilePicture struct {
		DisplayImage string `json:"displayImage"`
	} `json:"profilePicture"`
	Headline string `json:"headline"`
	Summary  string `json:"summary"`
	Location struct {
		Name string `json:"name"`
	} `json:"location"`
	Industry string `json:"industry"`
}

// LinkedInExperience represents work experience from LinkedIn
type LinkedInExperience struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	CompanyName string `json:"companyName"`
	Location    string `json:"location"`
	StartDate   struct {
		Year  int `json:"year"`
		Month int `json:"month"`
	} `json:"startDate"`
	EndDate struct {
		Year  int `json:"year"`
		Month int `json:"month"`
	} `json:"endDate"`
	Description string `json:"description"`
	IsCurrent   bool   `json:"isCurrent"`
}

// LinkedInEducation represents education from LinkedIn
type LinkedInEducation struct {
	ID           string `json:"id"`
	SchoolName   string `json:"schoolName"`
	DegreeName   string `json:"degreeName"`
	FieldOfStudy string `json:"fieldOfStudy"`
	StartDate    struct {
		Year  int `json:"year"`
		Month int `json:"month"`
	} `json:"startDate"`
	EndDate struct {
		Year  int `json:"year"`
		Month int `json:"month"`
	} `json:"endDate"`
	Grade string `json:"grade"`
}

// LinkedInSkill represents skills from LinkedIn
type LinkedInSkill struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// TableName overrides the table name
func (LinkedInAuthModel) TableName() string {
	return "linkedin_auth"
}

func (LinkedInProfileData) TableName() string {
	return "linkedin_profile_data"
}

// CreateLinkedInAuth creates a new LinkedIn authentication record
func (l *LinkedInAuthModel) Create() error {
	db := database.GetSqliteDB()
	return db.Create(&l).Error
}

// GetLinkedInAuthByUserID gets LinkedIn auth by user ID
func (l *LinkedInAuthModel) GetByUserID(userID uint) error {
	db := database.GetSqliteDB()
	return db.Where("user_id = ?", userID).First(&l).Error
}

// UpdateLinkedInAuth updates LinkedIn auth record
func (l *LinkedInAuthModel) Update() error {
	db := database.GetSqliteDB()
	return db.Save(&l).Error
}

// CreateLinkedInProfileData creates a new LinkedIn profile data record
func (l *LinkedInProfileData) Create() error {
	db := database.GetSqliteDB()
	return db.Create(&l).Error
}

// GetLinkedInProfileDataByUserID gets LinkedIn profile data by user ID
func (l *LinkedInProfileData) GetByUserID(userID uint) error {
	db := database.GetSqliteDB()
	return db.Where("user_id = ?", userID).First(&l).Error
}

// UpdateLinkedInProfileData updates LinkedIn profile data record
func (l *LinkedInProfileData) Update() error {
	db := database.GetSqliteDB()
	return db.Save(&l).Error
}

// UpsertLinkedInProfileData creates or updates LinkedIn profile data
func (l *LinkedInProfileData) Upsert() error {
	db := database.GetSqliteDB()
	var existing LinkedInProfileData
	err := db.Where("user_id = ?", l.UserID).First(&existing).Error

	if err != nil {
		// Record doesn't exist, create new one
		return l.Create()
	}

	// Record exists, update it
	l.ID = existing.ID
	l.CreatedAt = existing.CreatedAt
	return l.Update()
}
