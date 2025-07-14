package database

import (
	"fmt"
	"log"
	"os"
	"time"

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

	// Retry connection with exponential backoff
	maxRetries := 30
	retryDelay := time.Second

	for i := 0; i < maxRetries; i++ {
		log.Printf("Attempting to connect to PostgreSQL (attempt %d/%d)...", i+1, maxRetries)

		// Open connection to PostgreSQL
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("Failed to connect to PostgreSQL (attempt %d): %v", i+1, err)
			if i < maxRetries-1 {
				log.Printf("Retrying in %v...", retryDelay)
				time.Sleep(retryDelay)
				retryDelay *= 2 // Exponential backoff
				continue
			}
			return nil, fmt.Errorf("failed to connect to PostgreSQL after %d attempts: %w", maxRetries, err)
		}

		// Test the connection
		sqlDB, err := db.DB()
		if err != nil {
			log.Printf("Failed to get underlying sql.DB (attempt %d): %v", i+1, err)
			if i < maxRetries-1 {
				log.Printf("Retrying in %v...", retryDelay)
				time.Sleep(retryDelay)
				retryDelay *= 2
				continue
			}
			return nil, fmt.Errorf("failed to get underlying sql.DB after %d attempts: %w", maxRetries, err)
		}

		// Ping the database to ensure connection is working
		if err := sqlDB.Ping(); err != nil {
			log.Printf("Failed to ping PostgreSQL (attempt %d): %v", i+1, err)
			if i < maxRetries-1 {
				log.Printf("Retrying in %v...", retryDelay)
				time.Sleep(retryDelay)
				retryDelay *= 2
				continue
			}
			return nil, fmt.Errorf("failed to ping PostgreSQL after %d attempts: %w", maxRetries, err)
		}

		log.Printf("Successfully connected to PostgreSQL!")
		return db, nil
	}

	return nil, fmt.Errorf("failed to connect to PostgreSQL after %d attempts", maxRetries)
}
