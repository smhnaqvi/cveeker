package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
	"github.com/smhnaqvi/cvilo/utils"
)

type AIController struct {
	aiService *services.AIService
}

func NewAIController() *AIController {
	return &AIController{
		aiService: services.NewAIService(),
	}
}

// GenerateResumeFromPrompt creates a new resume using AI based on a text prompt
func (ac *AIController) GenerateResumeFromPrompt(c *gin.Context) {
	var request services.AIResumeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if request.Prompt == "" || request.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prompt and user_id are required"})
		return
	}

	// Check if user exists
	var user models.UserModel
	if err := user.GetUserByID(request.UserID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Set default template and theme if not provided
	if request.Template == "" {
		request.Template = "modern"
	}
	if request.Theme == "" {
		request.Theme = "blue"
	}

	// Generate resume title based on prompt and timestamp
	title := "AI Generated Resume - " + time.Now().Format("2006-01-02 15:04")

	// Generate resume using AI
	aiResponse, err := ac.aiService.GenerateResumeFromPrompt(request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate resume: " + err.Error()})
		return
	}

	// Convert AI response to ResumeModel
	resume, err := ac.aiService.ConvertAIResponseToResume(aiResponse, request.UserID, title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert AI response: " + err.Error()})
		return
	}

	// Save the resume to database
	if err := resume.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save resume: " + err.Error()})
		return
	}

	utils.Success(c, "Resume generated successfully using AI", gin.H{
		"resume":      resume,
		"ai_response": aiResponse,
	})
}

// UpdateResumeFromPrompt updates an existing resume using AI based on a text prompt
func (ac *AIController) UpdateResumeFromPrompt(c *gin.Context) {
	var request services.AIResumeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if request.Prompt == "" || request.UserID == 0 || request.ResumeID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prompt, user_id, and resume_id are required"})
		return
	}

	// Check if user exists
	var user models.UserModel
	if err := user.GetUserByID(request.UserID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Get existing resume
	var existingResume models.ResumeModel
	if err := existingResume.GetResumeByID(*request.ResumeID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
		return
	}

	// Verify that the resume belongs to the user
	if existingResume.UserID != request.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own resumes"})
		return
	}

	// Set default template and theme if not provided
	if request.Template == "" {
		request.Template = existingResume.Template
	}
	if request.Theme == "" {
		request.Theme = existingResume.Theme
	}

	// Update resume using AI
	aiResponse, err := ac.aiService.UpdateResumeFromPrompt(request, existingResume)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume: " + err.Error()})
		return
	}

	// Convert AI response to ResumeModel
	updatedResume, err := ac.aiService.ConvertAIResponseToResume(aiResponse, request.UserID, existingResume.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert AI response: " + err.Error()})
		return
	}

	// Update the existing resume
	updatedResume.ID = existingResume.ID
	updatedResume.CreatedAt = existingResume.CreatedAt
	updatedResume.UpdatedAt = time.Now()

	if err := existingResume.UpdateResume(*request.ResumeID, *updatedResume); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save updated resume: " + err.Error()})
		return
	}

	utils.Success(c, "Resume updated successfully using AI", gin.H{
		"resume":      updatedResume,
		"ai_response": aiResponse,
	})
}

// GenerateResumeFromPromptWithID creates a new resume using AI based on a text prompt (alternative endpoint)
func (ac *AIController) GenerateResumeFromPromptWithID(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var request struct {
		Prompt   string `json:"prompt" binding:"required"`
		Template string `json:"template,omitempty"`
		Theme    string `json:"theme,omitempty"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var user models.UserModel
	if err := user.GetUserByID(uint(userID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Create AI request
	aiRequest := services.AIResumeRequest{
		Prompt:   request.Prompt,
		UserID:   uint(userID),
		Template: request.Template,
		Theme:    request.Theme,
	}

	// Set default template and theme if not provided
	if aiRequest.Template == "" {
		aiRequest.Template = "modern"
	}
	if aiRequest.Theme == "" {
		aiRequest.Theme = "blue"
	}

	// Generate resume title based on prompt and timestamp
	title := "AI Generated Resume - " + time.Now().Format("2006-01-02 15:04")

	// Generate resume using AI
	aiResponse, err := ac.aiService.GenerateResumeFromPrompt(aiRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate resume: " + err.Error()})
		return
	}

	// Convert AI response to ResumeModel
	resume, err := ac.aiService.ConvertAIResponseToResume(aiResponse, uint(userID), title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert AI response: " + err.Error()})
		return
	}

	// Save the resume to database
	if err := resume.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save resume: " + err.Error()})
		return
	}

	utils.Success(c, "Resume generated successfully using AI", gin.H{
		"resume":      resume,
		"ai_response": aiResponse,
	})
}

// UpdateResumeFromPromptWithID updates an existing resume using AI based on a text prompt (alternative endpoint)
func (ac *AIController) UpdateResumeFromPromptWithID(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	resumeID, err := strconv.Atoi(c.Param("resume_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var request struct {
		Prompt   string `json:"prompt" binding:"required"`
		Template string `json:"template,omitempty"`
		Theme    string `json:"theme,omitempty"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var user models.UserModel
	if err := user.GetUserByID(uint(userID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Get existing resume
	var existingResume models.ResumeModel
	if err := existingResume.GetResumeByID(uint(resumeID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
		return
	}

	// Verify that the resume belongs to the user
	if existingResume.UserID != uint(userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own resumes"})
		return
	}

	// Create AI request
	aiRequest := services.AIResumeRequest{
		Prompt:   request.Prompt,
		UserID:   uint(userID),
		ResumeID: &existingResume.ID,
		Template: request.Template,
		Theme:    request.Theme,
	}

	// Set default template and theme if not provided
	if aiRequest.Template == "" {
		aiRequest.Template = existingResume.Template
	}
	if aiRequest.Theme == "" {
		aiRequest.Theme = existingResume.Theme
	}

	// Update resume using AI
	aiResponse, err := ac.aiService.UpdateResumeFromPrompt(aiRequest, existingResume)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume: " + err.Error()})
		return
	}

	// Convert AI response to ResumeModel
	updatedResume, err := ac.aiService.ConvertAIResponseToResume(aiResponse, uint(userID), existingResume.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert AI response: " + err.Error()})
		return
	}

	// Update the existing resume
	updatedResume.ID = existingResume.ID
	updatedResume.CreatedAt = existingResume.CreatedAt
	updatedResume.UpdatedAt = time.Now()

	if err := existingResume.UpdateResume(uint(resumeID), *updatedResume); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save updated resume: " + err.Error()})
		return
	}

	utils.Success(c, "Resume updated successfully using AI", gin.H{
		"resume":      updatedResume,
		"ai_response": aiResponse,
	})
}

// GetAIServiceStatus returns the status of the AI service
func (ac *AIController) GetAIServiceStatus(c *gin.Context) {
	status := "disabled"
	openaiConfigured := false

	if ac.aiService != nil {
		openaiConfigured = ac.aiService.IsConfigured()
		if openaiConfigured {
			status = "enabled"
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status":            status,
		"message":           "AI service status",
		"openai_configured": openaiConfigured,
	})
}
