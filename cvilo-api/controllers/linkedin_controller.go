package controllers

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
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
	log.Println("Creating new LinkedIn controller instance")
	return &LinkedInController{
		linkedInService: services.NewLinkedInService(),
	}
}

// GetAuthURL generates LinkedIn OAuth authorization URL
func (lc *LinkedInController) GetAuthURL(c *gin.Context) {
	log.Println("GetAuthURL: Starting LinkedIn OAuth URL generation")

	// Get user ID from query parameter or create a temporary state
	userID := c.Query("user_id")
	state := c.Query("state")
	redirectURL := c.Query("redirect_uri")

	log.Printf("GetAuthURL: Received user_id=%s, state=%s, redirect_uri=%s", userID, state, redirectURL)

	if state == "" {
		state = "default_state"
		log.Println("GetAuthURL: Using default state as none provided")
	}

	authURL := lc.linkedInService.GetAuthURL(state, redirectURL)
	log.Printf("GetAuthURL: Generated auth URL successfully, state=%s", state)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"auth_url": authURL,
			"state":    state,
			"user_id":  userID,
		},
		"message": "LinkedIn authorization URL generated successfully",
	})

	log.Println("GetAuthURL: Successfully returned auth URL to client")
}

// HandleCallback processes LinkedIn OAuth callback
func (lc *LinkedInController) HandleCallback(c *gin.Context) {
	log.Println("HandleCallback: Starting LinkedIn OAuth callback processing")

	code := c.Query("code")
	state := c.Query("state")
	redirectURI := os.Getenv("LINKEDIN_REDIRECT_URL")

	log.Printf("HandleCallback: Received authorization code, length=%d, state=%s, redirect_uri=%s", len(code), state, redirectURI)

	// Exchange authorization code for access token
	log.Println("HandleCallback: Exchanging authorization code for access token")
	tokenResponse, err := lc.linkedInService.ExchangeCodeForToken(code, redirectURI)
	if err != nil {
		log.Printf("HandleCallback: ERROR - Failed to exchange code for token: %v", err)
		utils.BadRequest(c, "Failed to exchange code for token", err.Error())
		return
	}

	log.Printf("HandleCallback: Successfully obtained access token, expires_in=%d", tokenResponse.ExpiresIn)

	// Get user profile data from LinkedIn and create resume
	log.Println("HandleCallback: Fetching user profile from LinkedIn")
	resume, err := lc.linkedInService.GetUserProfile(tokenResponse.AccessToken)
	if err != nil {
		log.Printf("HandleCallback: ERROR - Failed to fetch LinkedIn profile: %v", err)
		// If the access token has been revoked, prompt the user to reconnect
		if strings.Contains(err.Error(), "REVOKED_ACCESS_TOKEN") {
			log.Println("HandleCallback: ERROR - LinkedIn token revoked")
			utils.BadRequest(c, "LinkedIn token revoked", "Your LinkedIn access token has been revoked. Please reconnect your LinkedIn account.")
			return
		}
		utils.InternalError(c, "Failed to fetch LinkedIn profile", err.Error())
		return
	}

	log.Printf("HandleCallback: Successfully fetched LinkedIn profile for: %s", resume.FullName)

	// Try to find existing user by email or create new one
	user := &models.UserModel{}
	email := resume.Email

	log.Printf("HandleCallback: Processing user with email: %s", email)

	// If email is not available from LinkedIn, we'll need to handle this differently
	if email == "" {
		log.Println("HandleCallback: ERROR - Email not available from LinkedIn profile")
		utils.BadRequest(c, "Email not available from LinkedIn", "LinkedIn profile must have a public email address. Please ensure your LinkedIn profile has a public email address.")
		return
	}

	log.Println("HandleCallback: Looking up existing user by email")
	err = user.GetUserByEmail(email)
	if err != nil {
		log.Printf("HandleCallback: User not found, creating new user with email: %s, error: %v", email, err)
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
			log.Printf("HandleCallback: ERROR - Failed to create user: %v", err)
			utils.InternalError(c, "Failed to create user", err.Error())
			return
		}
		log.Printf("HandleCallback: Successfully created new user with ID: %d", user.ID)
	} else {
		log.Printf("HandleCallback: Found existing user with ID: %d", user.ID)
	}

	// Save LinkedIn authentication data
	log.Println("HandleCallback: Saving LinkedIn authentication data")
	linkedInID := lc.linkedInService.ExtractLinkedInID(resume.LinkedIn)
	log.Printf("HandleCallback: LinkedIn ID extracted: %s", linkedInID)

	// Check if LinkedIn auth already exists for this user
	existingAuth := &models.LinkedInAuthModel{}
	err = existingAuth.GetByUserID(user.ID)
	if err == nil {
		log.Printf("HandleCallback: Found existing LinkedIn auth for user ID: %d", user.ID)

		// Update existing auth for the same user
		existingAuth.LinkedInID = linkedInID
		existingAuth.AccessToken = tokenResponse.AccessToken
		existingAuth.RefreshToken = tokenResponse.RefreshToken
		existingAuth.TokenExpiry = time.Now().Add(time.Duration(tokenResponse.ExpiresIn) * time.Second)
		existingAuth.ProfileURL = resume.LinkedIn
		existingAuth.IsActive = true

		if err := existingAuth.Update(); err != nil {
			log.Printf("HandleCallback: ERROR - Failed to update LinkedIn authentication: %v", err)
			utils.InternalError(c, "Failed to update LinkedIn authentication", err.Error())
			return
		}
		log.Printf("HandleCallback: Successfully updated existing LinkedIn auth for user ID: %d", user.ID)
	} else {
		// Check if this LinkedIn ID is already associated with a different user
		existingAuthByLinkedInID := &models.LinkedInAuthModel{}
		err = existingAuthByLinkedInID.GetByLinkedInID(linkedInID)
		if err == nil {
			log.Printf("HandleCallback: LinkedIn ID %s is already associated with user ID %d, but current user is %d",
				linkedInID, existingAuthByLinkedInID.UserID, user.ID)

			// We need to handle this conflict. For now, we'll deactivate the old auth and create a new one
			// In a production system, you might want to merge accounts or ask the user what to do
			existingAuthByLinkedInID.IsActive = false
			if err := existingAuthByLinkedInID.Update(); err != nil {
				log.Printf("HandleCallback: ERROR - Failed to deactivate old LinkedIn auth: %v", err)
				utils.InternalError(c, "Failed to deactivate old LinkedIn auth", err.Error())
				return
			}
			log.Printf("HandleCallback: Deactivated old LinkedIn auth for user ID: %d", existingAuthByLinkedInID.UserID)
		}

		log.Printf("HandleCallback: Creating new LinkedIn auth for user ID: %d", user.ID)
		// Create new auth
		linkedInAuth := &models.LinkedInAuthModel{
			UserID:       user.ID,
			LinkedInID:   linkedInID,
			AccessToken:  tokenResponse.AccessToken,
			RefreshToken: tokenResponse.RefreshToken,
			TokenExpiry:  time.Now().Add(time.Duration(tokenResponse.ExpiresIn) * time.Second),
			ProfileURL:   resume.LinkedIn,
			IsActive:     true,
		}

		log.Printf("HandleCallback: LinkedIn auth created: %v", linkedInAuth)

		if err := linkedInAuth.Create(); err != nil {
			log.Printf("HandleCallback: ERROR - Failed to save LinkedIn authentication: %v", err)
			utils.InternalError(c, "Failed to save LinkedIn authentication", err.Error())
			return
		}
		log.Println("HandleCallback: Successfully created new LinkedIn auth")
	}

	// Check if user already has resumes and handle accordingly
	log.Println("HandleCallback: Checking for existing resumes")
	existingResumes, err := (&models.ResumeModel{}).GetResumesByUserID(user.ID)
	if err != nil {
		log.Printf("HandleCallback: No existing resumes found for user ID: %d", user.ID)
		// No existing resumes, create new one
		log.Println("HandleCallback: Creating new resume from LinkedIn data")
		resume.UserID = user.ID
		resume.Title = "LinkedIn Profile - " + resume.FullName
		if err := resume.Create(); err != nil {
			log.Printf("HandleCallback: ERROR - Failed to create resume from LinkedIn data: %v", err)
			utils.InternalError(c, "Failed to create resume from LinkedIn data", err.Error())
			return
		}
		log.Printf("HandleCallback: Successfully created new resume with ID: %d", resume.ID)
	} else {
		log.Printf("HandleCallback: Found %d existing resumes for user ID: %d", len(existingResumes), user.ID)

		// Check if there's already a resume created from LinkedIn (check by title pattern)
		var linkedInResume *models.ResumeModel
		for i := range existingResumes {
			if strings.Contains(existingResumes[i].Title, "LinkedIn Profile") {
				linkedInResume = &existingResumes[i]
				break
			}
		}

		if linkedInResume != nil {
			// Update existing LinkedIn resume
			log.Printf("HandleCallback: Updating existing LinkedIn resume with ID: %d", linkedInResume.ID)
			linkedInResume.FullName = resume.FullName
			linkedInResume.Email = resume.Email
			linkedInResume.Phone = resume.Phone
			linkedInResume.Address = resume.Address
			linkedInResume.Website = resume.Website
			linkedInResume.LinkedIn = resume.LinkedIn
			linkedInResume.GitHub = resume.GitHub
			linkedInResume.Summary = resume.Summary
			linkedInResume.Objective = resume.Objective
			linkedInResume.Experience = resume.Experience
			linkedInResume.Education = resume.Education
			linkedInResume.Skills = resume.Skills
			linkedInResume.Languages = resume.Languages
			linkedInResume.Certifications = resume.Certifications
			linkedInResume.Projects = resume.Projects
			linkedInResume.Awards = resume.Awards
			linkedInResume.Interests = resume.Interests
			linkedInResume.References = resume.References

			if err := linkedInResume.UpdateResume(linkedInResume.ID, *linkedInResume); err != nil {
				log.Printf("HandleCallback: ERROR - Failed to update existing LinkedIn resume: %v", err)
				utils.InternalError(c, "Failed to update existing LinkedIn resume", err.Error())
				return
			}
			log.Printf("HandleCallback: Successfully updated existing LinkedIn resume with ID: %d", linkedInResume.ID)
			resume.ID = linkedInResume.ID // Use the updated resume ID for the rest of the function
		} else {
			// Create new LinkedIn resume since none exists
			log.Println("HandleCallback: Creating new LinkedIn resume (no existing LinkedIn resume found)")
			resume.UserID = user.ID
			resume.Title = "LinkedIn Profile - " + resume.FullName
			if err := resume.Create(); err != nil {
				log.Printf("HandleCallback: ERROR - Failed to create resume from LinkedIn data: %v", err)
				utils.InternalError(c, "Failed to create resume from LinkedIn data", err.Error())
				return
			}
			log.Printf("HandleCallback: Successfully created new LinkedIn resume with ID: %d", resume.ID)
		}
	}

	// Update user with LinkedIn data if fields are empty
	log.Println("HandleCallback: Checking if user profile needs updates")
	userUpdated := false
	if user.Summary == "" && resume.Summary != "" {
		log.Println("HandleCallback: Updating user summary from LinkedIn")
		user.Summary = resume.Summary
		userUpdated = true
	}
	if user.Location == "" && resume.Address != "" {
		log.Println("HandleCallback: Updating user location from LinkedIn")
		user.Location = resume.Address
		userUpdated = true
	}
	if user.LinkedIn == "" && resume.LinkedIn != "" {
		log.Println("HandleCallback: Updating user LinkedIn URL from LinkedIn")
		user.LinkedIn = resume.LinkedIn
		userUpdated = true
	}

	if userUpdated {
		log.Printf("HandleCallback: Updating user profile with LinkedIn data")
		if err := user.UpdateUser(user.ID); err != nil {
			log.Printf("HandleCallback: ERROR - Failed to update user with LinkedIn data: %v", err)
			utils.InternalError(c, "Failed to update user with LinkedIn data", err.Error())
			return
		}
		log.Println("HandleCallback: Successfully updated user profile")
	} else {
		log.Println("HandleCallback: No user profile updates needed")
	}

	// generate jwt token pair
	authService := services.NewAuthService()
	tokenPair, err := authService.GenerateTokenPair(*user)
	if err != nil {
		log.Printf("HandleCallback: ERROR - Failed to generate JWT tokens: %v", err)
		utils.InternalError(c, "Failed to generate JWT tokens", err.Error())
		return
	}

	// redirect user to react app with the jwt access token and refresh token
	redirectURL := os.Getenv("REDIRECT_LINKEDIN_CLIENTAREA_URL") +
		"?access_token=" + tokenPair.AccessToken +
		"&refresh_token=" + tokenPair.RefreshToken
	c.Redirect(http.StatusSeeOther, redirectURL)
}

// SyncProfile syncs LinkedIn profile data and creates resume for a user
func (lc *LinkedInController) SyncProfile(c *gin.Context) {
	log.Println("SyncProfile: Starting LinkedIn profile sync")

	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		log.Printf("SyncProfile: ERROR - Invalid user ID format: %s, error: %v", userIDStr, err)
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	log.Printf("SyncProfile: Syncing profile for user ID: %d", userID)

	// Sync LinkedIn profile data and create resume
	if err := lc.linkedInService.SyncUserProfile(uint(userID)); err != nil {
		log.Printf("SyncProfile: ERROR - Failed to sync LinkedIn profile for user %d: %v", userID, err)
		utils.InternalError(c, "Failed to sync LinkedIn profile", err.Error())
		return
	}

	log.Printf("SyncProfile: Successfully synced LinkedIn profile for user ID: %d", userID)

	// Get the latest resume for the user
	log.Println("SyncProfile: Retrieving latest resume for user")
	resumes, err := (&models.ResumeModel{}).GetResumesByUserID(uint(userID))
	if err != nil || len(resumes) == 0 {
		log.Printf("SyncProfile: ERROR - No resumes found for user ID: %d, error: %v", userID, err)
		utils.NotFound(c, "Resume not found")
		return
	}

	latestResume := resumes[len(resumes)-1] // Get the most recent resume
	log.Printf("SyncProfile: Found %d resumes, using latest with ID: %d", len(resumes), latestResume.ID)

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

	log.Printf("SyncProfile: Successfully completed sync for user ID: %d", userID)
}

// GetLinkedInProfile gets the latest resume created from LinkedIn for a user
func (lc *LinkedInController) GetLinkedInProfile(c *gin.Context) {
	log.Println("GetLinkedInProfile: Starting LinkedIn profile retrieval")

	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		log.Printf("GetLinkedInProfile: ERROR - Invalid user ID format: %s, error: %v", userIDStr, err)
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	log.Printf("GetLinkedInProfile: Retrieving profile for user ID: %d", userID)

	// Get resumes for the user
	resumes, err := (&models.ResumeModel{}).GetResumesByUserID(uint(userID))
	if err != nil || len(resumes) == 0 {
		log.Printf("GetLinkedInProfile: ERROR - No resumes found for user ID: %d, error: %v", userID, err)
		utils.NotFound(c, "No resumes found for user")
		return
	}

	// Find the most recent resume (assuming it's the one from LinkedIn)
	latestResume := resumes[len(resumes)-1]
	log.Printf("GetLinkedInProfile: Found %d resumes, returning latest with ID: %d", len(resumes), latestResume.ID)

	utils.Success(c, "Resume data retrieved successfully", gin.H{
		"resume": latestResume,
	})

	log.Printf("GetLinkedInProfile: Successfully retrieved profile for user ID: %d", userID)
}

// DisconnectLinkedIn disconnects LinkedIn authentication for a user
func (lc *LinkedInController) DisconnectLinkedIn(c *gin.Context) {
	log.Println("DisconnectLinkedIn: Starting LinkedIn disconnection")

	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		log.Printf("DisconnectLinkedIn: ERROR - Invalid user ID format: %s, error: %v", userIDStr, err)
		utils.BadRequest(c, "Invalid user ID", err.Error())
		return
	}

	log.Printf("DisconnectLinkedIn: Disconnecting LinkedIn for user ID: %d", userID)

	// Get LinkedIn auth for the user
	linkedInAuth := &models.LinkedInAuthModel{}
	if err := linkedInAuth.GetByUserID(uint(userID)); err != nil {
		log.Printf("DisconnectLinkedIn: ERROR - LinkedIn authentication not found for user ID: %d, error: %v", userID, err)
		utils.NotFound(c, "LinkedIn authentication not found")
		return
	}

	log.Printf("DisconnectLinkedIn: Found LinkedIn auth for user ID: %d, deactivating", userID)

	// Deactivate LinkedIn auth
	linkedInAuth.IsActive = false
	if err := linkedInAuth.Update(); err != nil {
		log.Printf("DisconnectLinkedIn: ERROR - Failed to disconnect LinkedIn for user ID: %d, error: %v", userID, err)
		utils.InternalError(c, "Failed to disconnect LinkedIn", err.Error())
		return
	}

	log.Printf("DisconnectLinkedIn: Successfully disconnected LinkedIn for user ID: %d", userID)
	utils.Success(c, "LinkedIn disconnected successfully", nil)
}
