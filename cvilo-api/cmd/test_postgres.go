package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/smhnaqvi/cvilo/database"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Test PostgreSQL connection
	fmt.Println("Testing PostgreSQL connection...")

	// Initialize databases
	if err := database.InitializeDatabases(); err != nil {
		log.Fatal("Failed to initialize databases:", err)
	}
	defer database.CloseDatabases()

	// Test the connection
	db := database.GetPostgresDB()
	if db == nil {
		log.Fatal("Database connection is nil")
	}

	// Test a simple query
	var result int
	if err := db.Raw("SELECT 1").Scan(&result).Error; err != nil {
		log.Fatal("Failed to execute test query:", err)
	}

	fmt.Printf("✅ PostgreSQL connection successful! Test query result: %d\n", result)
	fmt.Println("🎉 Your PostgreSQL setup is working correctly!")
}
