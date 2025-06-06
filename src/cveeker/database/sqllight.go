package database

import (
	"fmt"
	"os"

	"github.com/glebarez/sqlite"
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

	return db, nil
}
