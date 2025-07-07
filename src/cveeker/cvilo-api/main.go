package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/smhnaqvi/cvilo/controllers"
	"github.com/smhnaqvi/cvilo/database"
	"github.com/smhnaqvi/cvilo/middleware"
	"github.com/smhnaqvi/cvilo/migration"
	"github.com/smhnaqvi/cvilo/utils"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database connection
	if err := database.InitializeDatabases(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.CloseDatabases()

	// Clear database
	// if err := database.ClearDatabase(); err != nil {
	// 	log.Fatal("Failed to clear database:", err)
	// }

	// Auto-migrate the schemas
	if err := migration.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Check for seed flag
	if len(os.Args) > 1 && os.Args[1] == "--seed" {
		if err := utils.SeedDatabase(database.GetSqliteDB()); err != nil {
			log.Fatal("Failed to seed database:", err)
		}
		log.Println("Database seeding completed. Exiting...")
		return
	}

	// Initialize controllers (no database parameters needed)
	authController := controllers.NewAuthController()
	userController := controllers.NewUserController()
	resumeController := controllers.NewResumeController()
	linkedInController := controllers.NewLinkedInController()
	aiController := controllers.NewAIController()

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
			"message":  "Cvilo API is running!",
			"version":  "2.0.0",
			"database": "Connected",
		})
	})

	// API version 1 routes
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authController.Login)          // User login
			auth.POST("/register", authController.Register)    // User registration
			auth.POST("/refresh", authController.RefreshToken) // Refresh token
			auth.GET("/verify", authController.VerifyToken)    // Verify token
		}

		// Protected routes (require authentication)
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/auth/me", authController.Me)                           // Get current user
			protected.POST("/auth/change-password", authController.ChangePassword) // Change password
		}

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
			resumes.GET("/:id/download-pdf", resumeController.DownloadResumePDF)   // Download resume as PDF
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

		// LinkedIn OAuth routes
		linkedin := v1.Group("/linkedin")
		{
			linkedin.GET("/auth-url", linkedInController.GetAuthURL)                  // Get LinkedIn OAuth URL
			linkedin.GET("/callback", linkedInController.HandleCallback)              // Handle OAuth callback
			linkedin.GET("/profile/:id", linkedInController.GetLinkedInProfile)       // Get LinkedIn profile data
			linkedin.POST("/sync/:id", linkedInController.SyncProfile)                // Sync LinkedIn profile data
			linkedin.DELETE("/disconnect/:id", linkedInController.DisconnectLinkedIn) // Disconnect LinkedIn
		}

		// AI Resume Builder routes
		ai := v1.Group("/ai")
		{
			ai.GET("/status", aiController.GetAIServiceStatus)                                              // Get AI service status
			ai.POST("/generate", aiController.GenerateResumeFromPrompt)                                     // Generate new resume from prompt
			ai.POST("/update", aiController.UpdateResumeFromPrompt)                                         // Update existing resume from prompt
			ai.POST("/users/:user_id/generate", aiController.GenerateResumeFromPromptWithID)                // Generate resume for specific user
			ai.POST("/users/:user_id/resumes/:resume_id/update", aiController.UpdateResumeFromPromptWithID) // Update specific resume
		}
	}

	// API documentation endpoint
	router.GET("/api/docs", func(c *gin.Context) {
		docs := gin.H{
			"title":       "Cvilo REST API Documentation",
			"version":     "2.0.0",
			"description": "A REST API for managing users and their resumes/CVs with global database connection",
			"base_url":    "http://localhost:8081/api/v1",
			"features": gin.H{
				"global_db_access": "Uses global database.GetSqliteDB() for clean, centralized database access",
				"controllers":      "Organized with controller-based architecture",
				"validation":       "Enhanced input validation and error handling",
				"relationships":    "Proper user-resume relationships with cascading operations",
				"linkedin_oauth":   "LinkedIn OAuth integration for profile data import",
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
					"GET /resumes/:id/download-pdf":  "Download resume as PDF",
				},
				"linkedin": gin.H{
					"GET /linkedin/auth-url":          "Get LinkedIn OAuth authorization URL",
					"POST /linkedin/callback":         "Handle LinkedIn OAuth callback and create resume",
					"GET /linkedin/profile/:id":       "Get latest resume created from LinkedIn for user",
					"POST /linkedin/sync/:id":         "Sync LinkedIn profile and create new resume",
					"DELETE /linkedin/disconnect/:id": "Disconnect LinkedIn for user",
				},
				"helpers": gin.H{
					"POST /helpers/parse-experience": "Parse experience data to JSON",
					"POST /helpers/parse-education":  "Parse education data to JSON",
					"POST /helpers/parse-skills":     "Parse skills data to JSON",
					"GET /sample-data":               "Get sample data structures",
				},
				"ai": gin.H{
					"GET /ai/status":                                    "Get AI service status",
					"POST /ai/generate":                                 "Generate new resume from prompt",
					"POST /ai/update":                                   "Update existing resume from prompt",
					"POST /ai/users/:user_id/generate":                  "Generate resume for specific user",
					"POST /ai/users/:user_id/resumes/:resume_id/update": "Update specific resume",
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
				"linkedin_oauth": gin.H{
					"get_auth_url": "GET /api/v1/linkedin/auth-url?user_id=1",
					"callback": gin.H{
						"url": "POST /api/v1/linkedin/callback",
						"body": gin.H{
							"code":  "authorization_code_from_linkedin",
							"state": "optional_state_parameter",
						},
						"response": gin.H{
							"user": gin.H{
								"id":    1,
								"name":  "John Doe",
								"email": "john@example.com",
							},
							"resume": gin.H{
								"id":        1,
								"title":     "LinkedIn Profile Resume",
								"full_name": "John Doe",
								"summary":   "Experienced software developer...",
								"linkedin":  "https://linkedin.com/in/johndoe",
							},
						},
					},
				},
			},
			"setup": gin.H{
				"seed_database": "Run `go run main.go --seed` to populate database with sample data",
				"start_server":  "Run `go run main.go` to start the API server",
				"architecture":  "Uses global database connection for clean, centralized access",
			},
		}
		c.JSON(http.StatusOK, docs)
	})

	log.Println("Cvilo API server starting on :8081")
	log.Println("API Documentation available at: http://localhost:8081/api/docs")
	log.Println("Health check available at: http://localhost:8081/ping")
	log.Println("To seed database with sample data, run: go run main.go --seed")
	log.Println("Architecture: Global database connection for clean, centralized access")

	// Start server
	if err := router.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
