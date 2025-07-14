package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectPostgresDatabase() (*gorm.DB, error) {
	// Get PostgreSQL connection details from environment variables
	host := os.Getenv("POSTGRES_HOST")
	port := os.Getenv("POSTGRES_PORT")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	sslmode := os.Getenv("POSTGRES_SSLMODE")

	// Set default values if not provided
	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "5432"
	}
	if sslmode == "" {
		sslmode = "disable"
	}

	// Construct the DSN (Data Source Name)
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	// Open connection to PostgreSQL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Test the connection
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Ping the database to ensure connection is working
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping PostgreSQL database: %w", err)
	}

	return db, nil
}
