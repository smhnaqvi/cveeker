package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

type ResumeController struct {
	db *gorm.DB
}

func NewResumeController(db *gorm.DB) *ResumeController {
	return &ResumeController{db: db}
}

// CreateResume creates a new resume for a user
func (rc *ResumeController) CreateResume(c *gin.Context) {
	var resume models.Resume
	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if resume.UserID == 0 || resume.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID and title are required"})
		return
	}

	// Check if user exists
	var user models.User
	if err := rc.db.First(&user, resume.UserID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if err := rc.db.Create(&resume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
		return
	}

	// Load the user relationship
	rc.db.Preload("User").First(&resume, resume.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Resume created successfully",
		"resume":  resume,
	})
}

// GetResume retrieves a resume by ID
func (rc *ResumeController) GetResume(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var resume models.Resume
	if err := rc.db.Preload("User").First(&resume, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	c.JSON(http.StatusOK, resume)
}

// GetResumesByUser retrieves all resumes for a specific user
func (rc *ResumeController) GetResumesByUser(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Check if user exists
	var user models.User
	if err := rc.db.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	var resumes []models.Resume
	if err := rc.db.Where("user_id = ?", userID).Preload("User").Find(&resumes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resumes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"resumes": resumes,
		"count":   len(resumes),
	})
}

// GetAllResumes retrieves all resumes with pagination
func (rc *ResumeController) GetAllResumes(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var resumes []models.Resume
	var total int64

	rc.db.Model(&models.Resume{}).Count(&total)
	if err := rc.db.Limit(limit).Offset(offset).Preload("User").Find(&resumes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resumes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"resumes": resumes,
		"pagination": gin.H{
			"current_page": page,
			"per_page":     limit,
			"total":        total,
			"total_pages":  (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// UpdateResume updates an existing resume
func (rc *ResumeController) UpdateResume(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var resume models.Resume
	if err := rc.db.First(&resume, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	var updateData models.Resume
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing the user ID
	updateData.UserID = resume.UserID

	if err := rc.db.Model(&resume).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume"})
		return
	}

	// Load the user relationship
	rc.db.Preload("User").First(&resume, resume.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Resume updated successfully",
		"resume":  resume,
	})
}

// DeleteResume deletes a resume by ID
func (rc *ResumeController) DeleteResume(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var resume models.Resume
	if err := rc.db.First(&resume, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	if err := rc.db.Delete(&resume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete resume"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume deleted successfully"})
}

// ToggleResumeStatus toggles the active status of a resume
func (rc *ResumeController) ToggleResumeStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var resume models.Resume
	if err := rc.db.First(&resume, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	resume.IsActive = !resume.IsActive
	if err := rc.db.Save(&resume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Resume status updated successfully",
		"is_active": resume.IsActive,
	})
}

// CloneResume creates a copy of an existing resume
func (rc *ResumeController) CloneResume(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var originalResume models.Resume
	if err := rc.db.First(&originalResume, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	// Create a copy
	clonedResume := originalResume
	clonedResume.ID = 0 // Reset ID for new record
	clonedResume.Title = originalResume.Title + " (Copy)"
	clonedResume.IsActive = false // Set clone as inactive by default

	if err := rc.db.Create(&clonedResume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clone resume"})
		return
	}

	// Load the user relationship
	rc.db.Preload("User").First(&clonedResume, clonedResume.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":       "Resume cloned successfully",
		"original_id":   originalResume.ID,
		"cloned_resume": clonedResume,
	})
}

// Helper functions for JSON parsing
func (rc *ResumeController) ParseExperience(c *gin.Context) {
	var experiences []models.WorkExperience
	if err := c.ShouldBindJSON(&experiences); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(experiences)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse experience data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"parsed_data": string(jsonData),
		"count":       len(experiences),
	})
}

func (rc *ResumeController) ParseEducation(c *gin.Context) {
	var education []models.Education
	if err := c.ShouldBindJSON(&education); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(education)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse education data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"parsed_data": string(jsonData),
		"count":       len(education),
	})
}

func (rc *ResumeController) ParseSkills(c *gin.Context) {
	var skills []models.Skill
	if err := c.ShouldBindJSON(&skills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(skills)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse skills data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"parsed_data": string(jsonData),
		"count":       len(skills),
	})
}
