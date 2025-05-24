package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ChatID     int64
	Name       string
	Email      string
	Phone      string
	Summary    string
	Education  string
	Experience string
	Skills     string
	Languages  string
	Step       string
}
