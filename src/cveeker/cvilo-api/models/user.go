package models

import (
	"errors"
	"time"

	"github.com/smhnaqvi/cvilo/database"
	"gorm.io/gorm"
)

type UserModel struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	// Personal Information
	ChatID   *int64 `json:"chat_id,omitempty" gorm:"unique"`
	Name     string `json:"name" gorm:"not null" validate:"required,min=2,max=100"`
	Email    string `json:"email" gorm:"uniqueIndex;not null" validate:"required,email"`
	Password string `json:"-" gorm:"not null" validate:"required,min=6"` // "-" means this field won't be included in JSON
	Phone    string `json:"phone" validate:"min=10,max=20"`

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
	Resumes []ResumeModel `json:"resumes,omitempty" gorm:"foreignKey:UserID"`
}

// TableName overrides the table name used by User to `users`
func (UserModel) TableName() string {
	return "users"
}

// BeforeCreate will set default values before creating
func (u *UserModel) BeforeCreate(tx *gorm.DB) error {
	if u.Step == "" {
		u.Step = "profile"
	}
	return nil
}

// UserCreateRequest represents the request structure for creating a user
type UserCreateRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
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

func (u *UserModel) Create() error {
	db := database.GetSqliteDB()
	if err := db.Create(&u).Error; err != nil {
		return err
	}
	return nil
}

func (u *UserModel) GetUserByEmail(email string) error {
	db := database.GetSqliteDB()
	if err := db.Where("email = ?", email).First(&u).Error; err == nil {
		return nil
	}
	return errors.New("user not found")
}

func (u *UserModel) GetUserByID(id uint) error {
	db := database.GetSqliteDB()
	if err := db.First(&u, id).Error; err == nil {
		return nil
	}
	return errors.New("user not found")
}

func (u *UserModel) GetAllUsers(offset int, limit int) ([]UserModel, int64, error) {
	db := database.GetSqliteDB()
	var users []UserModel
	var total int64
	db.Model(&UserModel{}).Count(&total)
	if err := db.Limit(limit).Offset(offset).Find(&users).Error; err == nil {
		return users, total, nil
	}
	return nil, 0, errors.New("users not found")
}

func (u *UserModel) UpdateUser(id uint) error {
	db := database.GetSqliteDB()
	if err := db.Model(&u).Where("id = ?", id).Updates(u).Error; err != nil {
		return err
	}

	db.Preload("Resumes").First(&u, u.ID)
	return nil
}

func (u *UserModel) DeleteUserResumes(id uint) error {
	db := database.GetSqliteDB()
	if err := db.Where("user_id = ?", id).Delete(&ResumeModel{}).Error; err != nil {
		return err
	}
	return nil
}

func (u *UserModel) DeactivateUser(id uint) error {
	db := database.GetSqliteDB()
	if err := db.Model(&u).Where("id = ?", id).Update("is_active", false).Error; err != nil {
		return err
	}
	db.Preload("Resumes").First(&u, u.ID)
	return nil
}

func (u *UserModel) GetUserByChatID(chatID int64) error {
	db := database.GetSqliteDB()
	if err := db.Where("chat_id = ?", chatID).First(&u).Error; err == nil {
		return nil
	}
	return errors.New("user not found")
}

// ToUserResponse converts UserModel to UserResponse
func (u *UserModel) ToUserResponse() UserResponse {
	return UserResponse{
		ID:         u.ID,
		CreatedAt:  u.CreatedAt,
		UpdatedAt:  u.UpdatedAt,
		Name:       u.Name,
		Email:      u.Email,
		Phone:      u.Phone,
		Summary:    u.Summary,
		Education:  u.Education,
		Experience: u.Experience,
		Skills:     u.Skills,
		Languages:  u.Languages,
		Location:   u.Location,
		Website:    u.Website,
		LinkedIn:   u.LinkedIn,
		GitHub:     u.GitHub,
		Step:       u.Step,
		IsActive:   u.IsActive,
	}
}
