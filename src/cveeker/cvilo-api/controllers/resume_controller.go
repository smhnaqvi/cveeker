package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
	"github.com/smhnaqvi/cvilo/utils"
)

type ResumeController struct {
	pdfService *services.PDFService
}

func NewResumeController() *ResumeController {
	return &ResumeController{
		pdfService: services.NewPDFService(),
	}
}

// CreateResume creates a new resume for a user
func (rc *ResumeController) CreateResume(c *gin.Context) {

	var resume models.ResumeModel
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
	var user models.UserModel
	if err := user.GetUserByID(resume.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if err := resume.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Resume created successfully",
			"resume":  resume,
		},
	})
}

// GetResume retrieves a resume by ID
func (rc *ResumeController) GetResume(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var resume models.ResumeModel
	if err := resume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	utils.Success(c, "Resumes retrieved successfully", gin.H{
		"resume": resume,
	})
}

// GetResumesByUser retrieves all resumes for a specific user
func (rc *ResumeController) GetResumesByUser(c *gin.Context) {

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Check if user exists
	var user models.UserModel
	if err := user.GetUserByID(uint(userID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	var resumeModel models.ResumeModel
	resumes, err := resumeModel.GetResumesByUserID(uint(userID))
	if err != nil {
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

	var resumeModel models.ResumeModel
	resumes, total, err := resumeModel.GetAllResumes(offset, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resumes"})
		return
	}

	utils.Success(c, "Resumes retrieved successfully", gin.H{
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

	var resume models.ResumeModel
	if err := resume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	var updateData models.ResumeModel
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing the user ID
	updateData.UserID = resume.UserID

	if err := resume.UpdateResume(uint(id), updateData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume"})
		return
	}

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

	var resume models.ResumeModel
	if err := resume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	if err := resume.DeleteResume(uint(id)); err != nil {
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

	// initialize the resume
	var resume models.ResumeModel

	// Get the resume
	if err := resume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	// Toggle the active status
	resume.IsActive = !resume.IsActive

	// Update the resume
	if err := resume.UpdateResume(uint(id), resume); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume status"})
		return
	}

	// Return the updated resume
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

	var originalResume models.ResumeModel
	if err := originalResume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resume"})
		return
	}

	// Create a copy
	clonedResume := originalResume
	clonedResume.ID = 0 // Reset ID for new record
	clonedResume.Title = originalResume.Title + " (Copy)"
	clonedResume.IsActive = false // Set clone as inactive by default

	if err := clonedResume.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clone resume"})
		return
	}

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

// DownloadResumePDF generates a PDF from the resume preview and returns it for download
func (rc *ResumeController) DownloadResumePDF(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	// Get the resume to verify it exists
	var resume models.ResumeModel
	if err := resume.GetResumeByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
		return
	}

	// Construct the preview URL with print mode

	previewURL := fmt.Sprintf("http://localhost:3009/dashboard/resume/%d/preview?print=true", id)

	log.Println("Preview URL:", previewURL)

	// Generate PDF from the preview URL with complete page loading detection
	pdfBuffer, err := rc.pdfService.GeneratePDFFromURL(previewURL, fmt.Sprintf("resume_%d.pdf", id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate PDF: %v", err)})
		return
	}

	// Set response headers for file download
	filename := fmt.Sprintf("resume_%s.pdf", resume.Title)
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Length", strconv.Itoa(len(pdfBuffer)))

	// Return the PDF buffer
	c.Data(http.StatusOK, "application/pdf", pdfBuffer)
}
