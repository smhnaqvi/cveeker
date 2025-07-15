package database

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

// DatabaseManager holds the PostgreSQL database connection
type DatabaseManager struct {
	PostgresDB *gorm.DB
}

// Global database manager instance
var DB *DatabaseManager

// InitializeDatabases connects to PostgreSQL and initializes the global DB manager
func InitializeDatabases() error {
	// Connect to PostgreSQL
	postgresDB, err := ConnectPostgresDatabase()
	if err != nil {
		return fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Initialize global database manager
	DB = &DatabaseManager{
		PostgresDB: postgresDB,
	}

	log.Println("PostgreSQL database connected successfully")
	return nil
}

// ClearDatabase clears all tables in the database
func ClearDatabase() error {
	if DB.PostgresDB == nil {
		return fmt.Errorf("no database connection available")
	}

	// Clear all tables
	tables := []string{"users", "resumes", "linkedin_resumes", "chat_prompt_history"}

	for _, table := range tables {
		if err := DB.PostgresDB.Exec(fmt.Sprintf("DELETE FROM %s", table)).Error; err != nil {
			log.Printf("Warning: failed to clear table %s: %v", table, err)
		}
	}

	// Reset sequences for PostgreSQL
	DB.PostgresDB.Exec("ALTER SEQUENCE users_id_seq RESTART WITH 1")
	DB.PostgresDB.Exec("ALTER SEQUENCE resumes_id_seq RESTART WITH 1")
	DB.PostgresDB.Exec("ALTER SEQUENCE linkedin_resumes_id_seq RESTART WITH 1")
	DB.PostgresDB.Exec("ALTER SEQUENCE chat_prompt_history_id_seq RESTART WITH 1")

	return nil
}

// GetPrimaryDB returns the PostgreSQL database instance
func GetPrimaryDB() *gorm.DB {
	if DB == nil {
		log.Fatal("Database manager not initialized. Call InitializeDatabases() first")
	}
	return DB.PostgresDB
}

// GetPostgresDB returns the PostgreSQL database instance
func GetPostgresDB() *gorm.DB {
	if DB == nil {
		log.Fatal("Database manager not initialized. Call InitializeDatabases() first")
	}
	return DB.PostgresDB
}

// CloseDatabases closes the PostgreSQL database connection
func CloseDatabases() error {
	if DB == nil {
		return nil
	}

	// Close PostgreSQL connection
	if DB.PostgresDB != nil {
		sqlDB, err := DB.PostgresDB.DB()
		if err == nil {
			if err := sqlDB.Close(); err != nil {
				log.Printf("Error closing PostgreSQL connection: %v", err)
			}
		}
	}

	log.Println("PostgreSQL database connection closed")
	return nil
}
