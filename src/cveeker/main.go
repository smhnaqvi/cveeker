package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

func main() {

	// Initialize database
	db, _ := gorm.Open(sqlite.Open("users.db"), &gorm.Config{})
	db.AutoMigrate(&models.User{})

	// Initialize router
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Start server
	router.Run() // listen and serve on 0.0.0.0:8080
}
