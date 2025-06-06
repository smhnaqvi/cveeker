package database

import (
	"fmt"
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

func ConnectSqliteDatabase() (*gorm.DB, error) {
	// load .env
	databaseURL := os.Getenv("SQL_CONNECTION")
	if databaseURL == "" {
		return nil, fmt.Errorf("SQL_CONNECTION is not set")
	}

	db, err := gorm.Open(sqlite.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto-migrate the schemas
	err = db.AutoMigrate(&models.User{}, &models.Resume{})
	if err != nil {
		return nil, err
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}
