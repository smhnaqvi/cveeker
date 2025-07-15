package migration

import (
	"log"

	"github.com/smhnaqvi/cvilo/database"
	"github.com/smhnaqvi/cvilo/models"
)

// Auto-migrate the schemas
func AutoMigrate() error {
	db := database.GetPostgresDB()
	err := db.AutoMigrate(&models.UserModel{}, &models.ResumeModel{}, &models.LinkedInAuthModel{}, &models.ChatPromptHistory{})
	if err != nil {
		return err
	}

	log.Println("PostgreSQL database connected and migrated successfully")
	return nil
}
