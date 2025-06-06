package models

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// InitDatabase creates and returns a database connection
func InitDatabase(databasePath string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(databasePath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto-migrate the schemas
	err = db.AutoMigrate(&User{}, &Resume{})
	if err != nil {
		return nil, err
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}

// CloseDatabase closes the database connection
func CloseDatabase(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
