package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/smhnaqvi/cveeker/handlers"
	"github.com/smhnaqvi/cveeker/models"
	"github.com/smhnaqvi/cveeker/utils"
	"gorm.io/gorm"
)

func main() {
	// Initialize database
	db, err := gorm.Open(sqlite.Open("cveeker.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schemas
	err = db.AutoMigrate(&models.User{}, &models.Resume{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Check for seed flag
	if len(os.Args) > 1 && os.Args[1] == "--seed" {
		if err := utils.SeedDatabase(db); err != nil {
			log.Fatal("Failed to seed database:", err)
		}
		log.Println("Database seeding completed. Exiting...")
		return
	}

	// Initialize handlers
	userHandler := handlers.NewUserHandler(db)
	resumeHandler := handlers.NewResumeHandler(db)

	// Initialize router
	router := gin.Default()

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Health check endpoint
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "CVeeker API is running!",
			"version": "1.0.0",
		})
	})

	// API version 1 routes
	v1 := router.Group("/api/v1")
	{
		// User routes
		users := v1.Group("/users")
		{
			users.POST("", userHandler.CreateUser)                    // Create user
			users.GET("", userHandler.GetUsers)                       // Get all users (with pagination)
			users.GET("/search", userHandler.GetUserByEmail)          // Get user by email
			users.GET("/:id", userHandler.GetUser)                    // Get user by ID
			users.PUT("/:id", userHandler.UpdateUser)                 // Update user
			users.DELETE("/:id", userHandler.DeleteUser)              // Delete user
			users.GET("/:id/resumes", resumeHandler.GetResumesByUser) // Get all resumes for a user
		}

		// Resume routes
		resumes := v1.Group("/resumes")
		{
			resumes.POST("", resumeHandler.CreateResume)                        // Create resume
			resumes.GET("", resumeHandler.GetAllResumes)                        // Get all resumes (with pagination)
			resumes.GET("/:id", resumeHandler.GetResume)                        // Get resume by ID
			resumes.PUT("/:id", resumeHandler.UpdateResume)                     // Update resume
			resumes.DELETE("/:id", resumeHandler.DeleteResume)                  // Delete resume
			resumes.POST("/:id/clone", resumeHandler.CloneResume)               // Clone resume
			resumes.PUT("/:id/toggle-status", resumeHandler.ToggleResumeStatus) // Toggle active status
		}

		// Helper routes for parsing complex JSON fields
		helpers := v1.Group("/helpers")
		{
			helpers.POST("/parse-experience", resumeHandler.ParseExperience) // Parse experience JSON
			helpers.POST("/parse-education", resumeHandler.ParseEducation)   // Parse education JSON
			helpers.POST("/parse-skills", resumeHandler.ParseSkills)         // Parse skills JSON
		}

		// Sample data endpoint
		v1.GET("/sample-data", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Sample data structures for reference",
				"data":    utils.GetSampleData(),
			})
		})
	}

	// API documentation endpoint
	router.GET("/api/docs", func(c *gin.Context) {
		docs := gin.H{
			"title":       "CVeeker REST API Documentation",
			"version":     "1.0.0",
			"description": "A REST API for managing users and their resumes/CVs",
			"base_url":    "http://localhost:8081/api/v1",
			"endpoints": gin.H{
				"users": gin.H{
					"POST /users":              "Create a new user",
					"GET /users":               "Get all users (with pagination)",
					"GET /users/:id":           "Get user by ID",
					"PUT /users/:id":           "Update user",
					"DELETE /users/:id":        "Delete user",
					"GET /users/search?email=": "Get user by email",
				},
				"resumes": gin.H{
					"POST /resumes":                  "Create a new resume",
					"GET /resumes":                   "Get all resumes (with pagination)",
					"GET /resumes/:id":               "Get resume by ID",
					"PUT /resumes/:id":               "Update resume",
					"DELETE /resumes/:id":            "Delete resume",
					"POST /resumes/:id/clone":        "Clone resume",
					"PUT /resumes/:id/toggle-status": "Toggle resume active status",
					"GET /users/:id/resumes":         "Get all resumes for a user",
				},
				"helpers": gin.H{
					"POST /helpers/parse-experience": "Parse experience data to JSON",
					"POST /helpers/parse-education":  "Parse education data to JSON",
					"POST /helpers/parse-skills":     "Parse skills data to JSON",
					"GET /sample-data":               "Get sample data structures",
				},
			},
			"sample_requests": gin.H{
				"create_user": gin.H{
					"url": "POST /api/v1/users",
					"body": gin.H{
						"name":    "John Doe",
						"email":   "john@example.com",
						"phone":   "+1234567890",
						"summary": "Software Developer with 5 years of experience",
					},
				},
				"create_resume": gin.H{
					"url": "POST /api/v1/resumes",
					"body": gin.H{
						"user_id":   1,
						"title":     "Software Developer Resume",
						"full_name": "John Doe",
						"email":     "john@example.com",
						"phone":     "+1234567890",
						"summary":   "Experienced software developer...",
						"skills":    `[{"name": "Go", "category": "Programming", "level": 4}]`,
					},
				},
			},
			"setup": gin.H{
				"seed_database": "Run `go run main.go --seed` to populate database with sample data",
				"start_server":  "Run `go run main.go` to start the API server",
			},
		}
		c.JSON(http.StatusOK, docs)
	})

	log.Println("CVeeker API server starting on :8081")
	log.Println("API Documentation available at: http://localhost:8081/api/docs")
	log.Println("Health check available at: http://localhost:8081/ping")
	log.Println("To seed database with sample data, run: go run main.go --seed")

	// Start server
	if err := router.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
