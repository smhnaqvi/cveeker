package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cveeker/controllers"
	"github.com/smhnaqvi/cveeker/models"
	"github.com/smhnaqvi/cveeker/utils"
)

func main() {
	// Initialize database connection
	db, err := models.InitDatabase("cveeker.db")
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer models.CloseDatabase(db)

	// Check for seed flag
	if len(os.Args) > 1 && os.Args[1] == "--seed" {
		if err := utils.SeedDatabase(db); err != nil {
			log.Fatal("Failed to seed database:", err)
		}
		log.Println("Database seeding completed. Exiting...")
		return
	}

	// Initialize controllers with database connection
	userController := controllers.NewUserController(db)
	resumeController := controllers.NewResumeController(db)

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
			"message":  "CVeeker API is running!",
			"version":  "2.0.0",
			"database": "Connected",
		})
	})

	// API version 1 routes
	v1 := router.Group("/api/v1")
	{
		// User routes
		users := v1.Group("/users")
		{
			users.POST("", userController.CreateUser)                        // Create user
			users.GET("", userController.GetUsers)                           // Get all users (with pagination)
			users.GET("/search", userController.GetUserByEmail)              // Get user by email
			users.GET("/:id", userController.GetUser)                        // Get user by ID
			users.PUT("/:id", userController.UpdateUser)                     // Update user
			users.DELETE("/:id", userController.DeleteUser)                  // Delete user
			users.PUT("/:id/toggle-status", userController.ToggleUserStatus) // Toggle user status
			users.GET("/:id/resumes", resumeController.GetResumesByUser)     // Get all resumes for a user
		}

		// Resume routes
		resumes := v1.Group("/resumes")
		{
			resumes.POST("", resumeController.CreateResume)                        // Create resume
			resumes.GET("", resumeController.GetAllResumes)                        // Get all resumes (with pagination)
			resumes.GET("/:id", resumeController.GetResume)                        // Get resume by ID
			resumes.PUT("/:id", resumeController.UpdateResume)                     // Update resume
			resumes.DELETE("/:id", resumeController.DeleteResume)                  // Delete resume
			resumes.POST("/:id/clone", resumeController.CloneResume)               // Clone resume
			resumes.PUT("/:id/toggle-status", resumeController.ToggleResumeStatus) // Toggle active status
		}

		// Helper routes for parsing complex JSON fields
		helpers := v1.Group("/helpers")
		{
			helpers.POST("/parse-experience", resumeController.ParseExperience) // Parse experience JSON
			helpers.POST("/parse-education", resumeController.ParseEducation)   // Parse education JSON
			helpers.POST("/parse-skills", resumeController.ParseSkills)         // Parse skills JSON
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
			"version":     "2.0.0",
			"description": "A REST API for managing users and their resumes/CVs with direct GORM database access",
			"base_url":    "http://localhost:8081/api/v1",
			"features": gin.H{
				"direct_db_access": "Uses *gorm.DB directly for cleaner, more conventional code",
				"controllers":      "Organized with controller-based architecture",
				"validation":       "Enhanced input validation and error handling",
				"relationships":    "Proper user-resume relationships with cascading operations",
			},
			"endpoints": gin.H{
				"users": gin.H{
					"POST /users":                  "Create a new user",
					"GET /users":                   "Get all users (with pagination)",
					"GET /users/:id":               "Get user by ID (includes resumes)",
					"PUT /users/:id":               "Update user (partial updates supported)",
					"DELETE /users/:id":            "Delete user (cascades to resumes)",
					"GET /users/search?email=":     "Get user by email",
					"PUT /users/:id/toggle-status": "Toggle user active status",
					"GET /users/:id/resumes":       "Get all resumes for a user",
				},
				"resumes": gin.H{
					"POST /resumes":                  "Create a new resume",
					"GET /resumes":                   "Get all resumes (with pagination)",
					"GET /resumes/:id":               "Get resume by ID",
					"PUT /resumes/:id":               "Update resume",
					"DELETE /resumes/:id":            "Delete resume",
					"POST /resumes/:id/clone":        "Clone resume",
					"PUT /resumes/:id/toggle-status": "Toggle resume active status",
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
						"name":     "John Doe",
						"email":    "john@example.com",
						"phone":    "+1234567890",
						"summary":  "Software Developer with 5 years of experience",
						"location": "San Francisco, CA",
						"website":  "https://johndoe.dev",
						"linkedin": "https://linkedin.com/in/johndoe",
						"github":   "https://github.com/johndoe",
					},
				},
				"update_user": gin.H{
					"url": "PUT /api/v1/users/1",
					"body": gin.H{
						"summary":   "Updated summary",
						"skills":    "Go, JavaScript, React, Docker",
						"location":  "New York, NY",
						"is_active": true,
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
				"architecture":  "Uses direct *gorm.DB access for cleaner, more conventional code",
			},
		}
		c.JSON(http.StatusOK, docs)
	})

	log.Println("CVeeker API server starting on :8081")
	log.Println("API Documentation available at: http://localhost:8081/api/docs")
	log.Println("Health check available at: http://localhost:8081/ping")
	log.Println("To seed database with sample data, run: go run main.go --seed")
	log.Println("Architecture: Direct *gorm.DB access for cleaner, more conventional code")

	// Start server
	if err := router.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
