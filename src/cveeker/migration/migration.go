package migration

import (
	"log"

	"github.com/smhnaqvi/cveeker/database"
	"github.com/smhnaqvi/cveeker/models"
)

// Auto-migrate the schemas
func AutoMigrate() error {
	db := database.GetSqliteDB()
	err := db.AutoMigrate(&models.UserModel{}, &models.ResumeModel{})
	if err != nil {
		return err
	}

	log.Println("Database connected and migrated successfully")
	return nil
}
