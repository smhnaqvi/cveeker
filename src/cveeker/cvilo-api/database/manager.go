package database

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

// DatabaseManager holds all database connections
type DatabaseManager struct {
	SQLiteDB *gorm.DB
}

// Global database manager instance
var DB *DatabaseManager

// InitializeDatabases connects to all databases and initializes the global DB manager
func InitializeDatabases() error {
	// Connect to SQLite
	sqliteDB, err := ConnectSqliteDatabase()
	if err != nil {
		return fmt.Errorf("failed to connect to SQLite: %w", err)
	}

	// Initialize global database manager
	DB = &DatabaseManager{
		SQLiteDB: sqliteDB,
	}

	log.Println("All database connections initialized successfully")
	return nil
}

// ClearDatabase clears all tables in the database
func ClearDatabase() error {

	// delete all tables
	DB.SQLiteDB.Exec("DELETE FROM sqlite_sequence")
	DB.SQLiteDB.Exec("DELETE FROM users")
	DB.SQLiteDB.Exec("DELETE FROM resumes")
	DB.SQLiteDB.Exec("DELETE FROM linkedin_resumes")
	return nil
}

// GetSqliteDB returns the SQLite database instance
func GetSqliteDB() *gorm.DB {
	if DB == nil {
		log.Fatal("Database manager not initialized. Call InitializeDatabases() first")
	}
	return DB.SQLiteDB
}

// CloseDatabases closes all database connections
func CloseDatabases() error {
	if DB == nil {
		return nil
	}

	// Close SQLite connection
	if DB.SQLiteDB != nil {
		sqlDB, err := DB.SQLiteDB.DB()
		if err == nil {
			if err := sqlDB.Close(); err != nil {
				log.Printf("Error closing PostgreSQL connection: %v", err)
			}
		}
	}

	log.Println("All database connections closed")
	return nil
}
