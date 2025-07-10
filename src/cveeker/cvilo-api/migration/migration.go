package migration

import (
	"log"

	"github.com/smhnaqvi/cvilo/database"
	"github.com/smhnaqvi/cvilo/models"
)

// Auto-migrate the schemas
func AutoMigrate() error {
	db := database.GetSqliteDB()
	err := db.AutoMigrate(&models.UserModel{}, &models.ResumeModel{}, &models.LinkedInAuthModel{}, &models.ChatPromptHistory{})
	if err != nil {
		return err
	}

	log.Println("Database connected and migrated successfully")
	return nil
}
