package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	// Personal Information
	ChatID *int64 `json:"chat_id,omitempty" gorm:"unique"`
	Name   string `json:"name" gorm:"not null" validate:"required,min=2,max=100"`
	Email  string `json:"email" gorm:"uniqueIndex;not null" validate:"required,email"`
	Phone  string `json:"phone" validate:"min=10,max=20"`

	// Professional Information
	Summary    string `json:"summary" gorm:"type:text"`
	Education  string `json:"education" gorm:"type:text"`
	Experience string `json:"experience" gorm:"type:text"`
	Skills     string `json:"skills" gorm:"type:text"`
	Languages  string `json:"languages" gorm:"type:text"`

	// Additional Fields
	Location string `json:"location"`
	Website  string `json:"website"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`

	// System Fields
	Step     string `json:"step" gorm:"default:'profile'"`
	IsActive bool   `json:"is_active" gorm:"default:true"`

	// Relationships
	Resumes []Resume `json:"resumes,omitempty" gorm:"foreignKey:UserID"`
}

// TableName overrides the table name used by User to `users`
func (User) TableName() string {
	return "users"
}

// BeforeCreate will set default values before creating
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Step == "" {
		u.Step = "profile"
	}
	return nil
}

// UserCreateRequest represents the request structure for creating a user
type UserCreateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone" validate:"min=10,max=20"`
	Summary  string `json:"summary"`
	Location string `json:"location"`
	Website  string `json:"website"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
}

// UserUpdateRequest represents the request structure for updating a user
type UserUpdateRequest struct {
	Name       string `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Phone      string `json:"phone,omitempty" validate:"omitempty,min=10,max=20"`
	Summary    string `json:"summary,omitempty"`
	Education  string `json:"education,omitempty"`
	Experience string `json:"experience,omitempty"`
	Skills     string `json:"skills,omitempty"`
	Languages  string `json:"languages,omitempty"`
	Location   string `json:"location,omitempty"`
	Website    string `json:"website,omitempty"`
	LinkedIn   string `json:"linkedin,omitempty"`
	GitHub     string `json:"github,omitempty"`
	Step       string `json:"step,omitempty"`
	IsActive   *bool  `json:"is_active,omitempty"`
}

// UserResponse represents the response structure for user data
type UserResponse struct {
	ID         uint      `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	Summary    string    `json:"summary"`
	Education  string    `json:"education"`
	Experience string    `json:"experience"`
	Skills     string    `json:"skills"`
	Languages  string    `json:"languages"`
	Location   string    `json:"location"`
	Website    string    `json:"website"`
	LinkedIn   string    `json:"linkedin"`
	GitHub     string    `json:"github"`
	Step       string    `json:"step"`
	IsActive   bool      `json:"is_active"`
}
