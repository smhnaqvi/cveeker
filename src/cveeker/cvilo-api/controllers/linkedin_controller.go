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

// LinkedInController handles LinkedIn OAuth and profile operations
type LinkedInController struct {
	linkedInService *services.LinkedInService
}

// NewLinkedInController creates a new LinkedIn controller instance
func NewLinkedInController() *LinkedInController {
	return &LinkedInController{
		linkedInService: services.NewLinkedInService(),
	}
}

// GetAuthURL generates LinkedIn OAuth authorization URL
func (lc *LinkedInController) GetAuthURL(c *gin.Context) {
	// Get user ID from query parameter or create a temporary state
	userID := c.Query("user_id")
	state := c.Query("state")

	if state == "" {
		state = "default_state"
	}

	authURL := lc.linkedInService.GetAuthURL(state)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"auth_url": authURL,
			"state":    state,
			"user_id":  userID,
		},
		"message": "LinkedIn authorization URL generated successfully",
	})
}

// HandleCallback processes LinkedIn OAuth callback
func (lc *LinkedInController) HandleCallback(c *gin.Context) {
	var request models.LinkedInAuthRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequest(c, "Invalid request data", err.Error())
		return
	}

	// Exchange authorization code for access token
	tokenResponse, err := lc.linkedInService.ExchangeCodeForToken(request.Code)
	if err != nil {
		utils.BadRequest(c, "Failed to exchange code for token", err.Error())
		return
	}

	// Get user profile data from LinkedIn and create resume
	resume, err := lc.linkedInService.GetUserProfile(tokenResponse.AccessToken)
	if err != nil {
		utils.InternalError(c, "Failed to fetch LinkedIn profile", err.Error())
		return
	}

	// Try to find existing user by email or create new one
	user := &models.UserModel{}
	email := resume.Email

	// If email is not available from LinkedIn, we'll need to handle this differently
	if email == "" {
		utils.BadRequest(c, "Email not available from LinkedIn", "LinkedIn profile must have a public email address")
		return
	}

	err = user.GetUserByEmail(email)
	if err != nil {
		// User doesn't exist, create new user
		user = &models.UserModel{
			Name:     resume.FullName,
			Email:    email,
			Summary:  resume.Summary,
			Location: resume.Address,
			LinkedIn: resume.LinkedIn,
			Step:     "profile",
			IsActive: true,
		}

		if err := user.Create(); err != nil {
			utils.InternalError(c, "Failed to create user", err.Error())
			return
		}
	}

	// Save LinkedIn authentication data
	linkedInAuth := &models.LinkedInAuthModel{
		UserID:       user.ID,
		LinkedInID:   lc.linkedInService.ExtractLinkedInID(resume.LinkedIn),
		AccessToken:  tokenResponse.AccessToken,
		RefreshToken: tokenResponse.RefreshToken,
		TokenExpiry:  time.Now().Add(time.Duration(tokenResponse.ExpiresIn) * time.Second),
		ProfileURL:   resume.LinkedIn,
		IsActive:     true,
	}

	// Check if LinkedIn auth already exists for this user
	existingAuth := &models.LinkedInAuthModel{}
	err = existingAuth.GetByUserID(user.ID)
	if err == nil {
		// Update existing auth
		existingAuth.AccessToken = linkedInAuth.AccessToken
		existingAuth.RefreshToken = linkedInAuth.RefreshToken
		existingAuth.TokenExpiry = linkedInAuth.TokenExpiry
		existingAuth.ProfileURL = linkedInAuth.ProfileURL
		existingAuth.IsActive = true

		if err := existingAuth.Update(); err != nil {
			utils.InternalError(c, "Failed to update LinkedIn authentication", err.Error())
			return
		}
	} else {
		// Create new auth
		if err := linkedInAuth.Create(); err != nil {
			utils.InternalError(c, "Failed to save LinkedIn authentication", err.Error())
			return
		}
	}

	// Create resume from LinkedIn data
	resume.UserID = user.ID
	if err := resume.Create(); err != nil {
		utils.InternalError(c, "Failed to create resume from LinkedIn data", err.Error())
		return
	}

	// Update user with LinkedIn data if fields are empty
	userUpdated := false
	if user.Summary == "" && resume.Summary != "" {
		user.Summary = resume.Summary
		userUpdated = true
	}
	if user.Location == "" && resume.Address != "" {
		user.Location = resume.Address
		userUpdated = true
	}
	if user.LinkedIn == "" && resume.LinkedIn != "" {
		user.LinkedIn = resume.LinkedIn
		userUpdated = true
	}

	if userUpdated {
		if err := user.UpdateUser(user.ID); err != nil {
			utils.InternalError(c, "Failed to update user with LinkedIn data", err.Error())
			return
		}
	}

	utils.Success(c, "LinkedIn authentication successful", gin.H{
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
		"resume": gin.H{
			"id":        resume.ID,
			"title":     resume.Title,
			"full_name": resume.FullName,
			"summary":   resume.Summary,
			"linkedin":  resume.LinkedIn,
		},
	})
}

// SyncProfile syncs LinkedIn profile data and creates resume for a user
func (lc *LinkedInController) SyncProfile(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	// Sync LinkedIn profile data and create resume
	if err := lc.linkedInService.SyncUserProfile(uint(userID)); err != nil {
		utils.InternalError(c, "Failed to sync LinkedIn profile", err.Error())
		return
	}

	// Get the latest resume for the user
	resumes, err := (&models.ResumeModel{}).GetResumesByUserID(uint(userID))
	if err != nil || len(resumes) == 0 {
		utils.NotFound(c, "Resume not found")
		return
	}

	latestResume := resumes[len(resumes)-1] // Get the most recent resume

	utils.Success(c, "LinkedIn profile synced and resume created successfully", gin.H{
		"resume": gin.H{
			"id":         latestResume.ID,
			"title":      latestResume.Title,
			"full_name":  latestResume.FullName,
			"summary":    latestResume.Summary,
			"address":    latestResume.Address,
			"linkedin":   latestResume.LinkedIn,
			"created_at": latestResume.CreatedAt,
		},
	})
}

// GetLinkedInProfile gets the latest resume created from LinkedIn for a user
func (lc *LinkedInController) GetLinkedInProfile(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	// Get resumes for the user
	resumes, err := (&models.ResumeModel{}).GetResumesByUserID(uint(userID))
	if err != nil || len(resumes) == 0 {
		utils.NotFound(c, "No resumes found for user")
		return
	}

	// Find the most recent resume (assuming it's the one from LinkedIn)
	latestResume := resumes[len(resumes)-1]

	utils.Success(c, "Resume data retrieved successfully", gin.H{
		"resume": latestResume,
	})
}

// DisconnectLinkedIn disconnects LinkedIn authentication for a user
func (lc *LinkedInController) DisconnectLinkedIn(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	// Get LinkedIn auth for the user
	linkedInAuth := &models.LinkedInAuthModel{}
	if err := linkedInAuth.GetByUserID(uint(userID)); err != nil {
		utils.NotFound(c, "LinkedIn authentication not found")
		return
	}

	// Deactivate LinkedIn auth
	linkedInAuth.IsActive = false
	if err := linkedInAuth.Update(); err != nil {
		utils.InternalError(c, "Failed to disconnect LinkedIn", err.Error())
		return
	}

	utils.Success(c, "LinkedIn disconnected successfully", nil)
}
