package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/smhnaqvi/cvilo/models"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/linkedin"
)

// LinkedInService handles LinkedIn OAuth and profile data fetching
type LinkedInService struct {
	config *oauth2.Config
}

// NewLinkedInService creates a new LinkedIn service instance
func NewLinkedInService() *LinkedInService {
	clientID := os.Getenv("LINKEDIN_CLIENT_ID")
	clientSecret := os.Getenv("LINKEDIN_CLIENT_SECRET")
	redirectURL := os.Getenv("LINKEDIN_REDIRECT_URL")

	log.Printf("NewLinkedInService: Initializing with client_id=%s, redirect_url=%s",
		maskString(clientID), redirectURL)

	if clientID == "" || clientSecret == "" || redirectURL == "" {
		log.Printf("NewLinkedInService: ERROR - Missing environment variables. client_id=%t, client_secret=%t, redirect_url=%t",
			clientID != "", clientSecret != "", redirectURL != "")
		panic("LinkedIn OAuth credentials not configured. Please set LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, and LINKEDIN_REDIRECT_URL environment variables.")
	}

	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes: []string{
			"openid",
			"profile",
			"email",
			"w_member_social",
		},
		Endpoint: linkedin.Endpoint,
	}

	log.Printf("NewLinkedInService: Successfully initialized LinkedIn service with redirect_url=%s", redirectURL)

	return &LinkedInService{
		config: config,
	}
}

// maskString masks sensitive data for logging
func maskString(s string) string {
	if len(s) <= 4 {
		return "***"
	}
	return s[:4] + "***"
}

// GetAuthURL generates the LinkedIn OAuth authorization URL
func (s *LinkedInService) GetAuthURL(state string, redirectURL string) string {
	// Use provided redirect URL if available, otherwise use the default from config
	effectiveRedirectURL := s.config.RedirectURL
	if redirectURL != "" {
		effectiveRedirectURL = redirectURL
		log.Printf("GetAuthURL: Using custom redirect URL: %s", effectiveRedirectURL)
	} else {
		log.Printf("GetAuthURL: Using default redirect URL: %s", effectiveRedirectURL)
	}

	log.Printf("GetAuthURL: Generating auth URL with state=%s, redirect_url=%s", state, effectiveRedirectURL)

	// Create a temporary config with the custom redirect URL
	tempConfig := &oauth2.Config{
		ClientID:     s.config.ClientID,
		ClientSecret: s.config.ClientSecret,
		RedirectURL:  effectiveRedirectURL,
		Scopes:       s.config.Scopes,
		Endpoint:     s.config.Endpoint,
	}

	authURL := tempConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	log.Printf("GetAuthURL: Generated auth URL: %s", authURL)
	return authURL
}

// ExchangeCodeForToken exchanges authorization code for access token
func (s *LinkedInService) ExchangeCodeForToken(code string, redirectURL string) (*models.LinkedInAuthResponse, error) {
	// Use provided redirect URL if available, otherwise use the default from config
	effectiveRedirectURL := s.config.RedirectURL
	if redirectURL != "" {
		effectiveRedirectURL = redirectURL
		log.Printf("ExchangeCodeForToken: Using custom redirect URL: %s", effectiveRedirectURL)
	} else {
		log.Printf("ExchangeCodeForToken: Using default redirect URL: %s", effectiveRedirectURL)
	}

	log.Printf("ExchangeCodeForToken: Attempting to exchange code, length=%d, redirect_url=%s", len(code), effectiveRedirectURL)

	// Create a temporary config with the custom redirect URL
	tempConfig := &oauth2.Config{
		ClientID:     s.config.ClientID,
		ClientSecret: s.config.ClientSecret,
		RedirectURL:  effectiveRedirectURL,
		Scopes:       s.config.Scopes,
		Endpoint:     s.config.Endpoint,
	}

	token, err := tempConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		log.Printf("ExchangeCodeForToken: ERROR - Failed to exchange code: %v", err)
		return nil, fmt.Errorf("failed to exchange code for token: %w", err)
	}

	log.Printf("ExchangeCodeForToken: Successfully exchanged code for token, expires_in=%d", int(token.Expiry.Sub(time.Now()).Seconds()))

	return &models.LinkedInAuthResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    int(token.Expiry.Sub(time.Now()).Seconds()),
		TokenType:    token.TokenType,
	}, nil
}

// GetUserProfile fetches the user's LinkedIn profile data and converts it to resume format
func (s *LinkedInService) GetUserProfile(accessToken string) (*models.ResumeModel, error) {
	log.Println("GetUserProfile: Fetching user profile from LinkedIn UserInfo endpoint")

	// Get basic profile information from OpenID Connect UserInfo endpoint
	profileURL := "https://api.linkedin.com/v2/userinfo"
	req, err := http.NewRequest("GET", profileURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("X-Restli-Protocol-Version", "2.0.0")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch profile: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("LinkedIn API error: %s - %s", resp.Status, string(body))
	}

	var ui struct {
		Sub        string `json:"sub"`
		Name       string `json:"name"`
		GivenName  string `json:"given_name"`
		FamilyName string `json:"family_name"`
		Picture    string `json:"picture"`
		Email      string `json:"email"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&ui); err != nil {
		return nil, fmt.Errorf("failed to decode userinfo response: %w", err)
	}

	log.Printf("GetUserProfile: Successfully fetched profile for user: %s (sub: %s)", ui.Name, ui.Sub)

	// Create resume from LinkedIn profile data
	resume := &models.ResumeModel{
		Title:    "LinkedIn Profile Resume",
		IsActive: true,
		Template: "modern",
		Theme:    "blue",
	}

	// Use struct fields for profile information
	resume.FullName = ui.Name
	resume.LinkedIn = fmt.Sprintf("https://www.linkedin.com/in/%s", ui.Sub)
	resume.Email = ui.Email

	// Set basic summary from available data
	if ui.GivenName != "" && ui.FamilyName != "" {
		resume.Summary = fmt.Sprintf("Professional profile for %s %s", ui.GivenName, ui.FamilyName)
	} else {
		resume.Summary = fmt.Sprintf("Professional profile for %s", ui.Name)
	}

	log.Printf("GetUserProfile: Created resume with basic information - Name: %s, Email: %s", resume.FullName, resume.Email)

	return resume, nil
}

// populateResumeFromLinkedIn fetches additional profile information and populates resume
func (s *LinkedInService) populateResumeFromLinkedIn(resume *models.ResumeModel, accessToken string) error {
	// Get profile with additional fields - using a more basic projection that works with r_liteprofile
	profileURL := "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,headline,summary,location,industry)"

	req, err := http.NewRequest("GET", profileURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("X-Restli-Protocol-Version", "2.0.0")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch detailed profile: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("LinkedIn API error: %s - %s", resp.Status, string(body))
	}

	var detailedProfile map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&detailedProfile); err != nil {
		return fmt.Errorf("failed to decode detailed profile response: %w", err)
	}

	// Extract basic information
	resume.Summary = extractString(detailedProfile, "summary")

	if location, ok := detailedProfile["location"].(map[string]interface{}); ok {
		resume.Address = extractString(location, "name")
	}

	// Note: With r_liteprofile scope, we can only access basic profile information
	// Detailed data like positions, education, skills, etc. require additional permissions
	// that may not be approved for all apps. For now, we'll create a basic resume
	// with the information we can access.

	return nil
}

// convertLinkedInPositionsToResumeExperience converts LinkedIn positions to resume experience format
func (s *LinkedInService) convertLinkedInPositionsToResumeExperience(elements []interface{}) []models.WorkExperience {
	var experiences []models.WorkExperience

	for _, element := range elements {
		if position, ok := element.(map[string]interface{}); ok {
			experience := models.WorkExperience{
				Company:   extractString(position, "companyName"),
				Position:  extractString(position, "title"),
				Location:  extractString(position, "location"),
				IsCurrent: extractBool(position, "isCurrent"),
			}

			// Handle dates
			if startDate, ok := position["startDate"].(map[string]interface{}); ok {
				year := int(extractFloat(startDate, "year"))
				month := int(extractFloat(startDate, "month"))
				if year > 0 {
					experience.StartDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
				}
			}

			if !experience.IsCurrent {
				if endDate, ok := position["endDate"].(map[string]interface{}); ok {
					year := int(extractFloat(endDate, "year"))
					month := int(extractFloat(endDate, "month"))
					if year > 0 {
						endTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
						experience.EndDate = &endTime
					}
				}
			}

			experiences = append(experiences, experience)
		}
	}

	return experiences
}

// convertLinkedInEducationToResumeEducation converts LinkedIn education to resume education format
func (s *LinkedInService) convertLinkedInEducationToResumeEducation(elements []interface{}) []models.Education {
	var educations []models.Education

	for _, element := range elements {
		if education, ok := element.(map[string]interface{}); ok {
			edu := models.Education{
				Institution:  extractString(education, "schoolName"),
				Degree:       extractString(education, "degreeName"),
				FieldOfStudy: extractString(education, "fieldOfStudy"),
				Location:     extractString(education, "location"),
			}

			// Handle dates
			if startDate, ok := education["startDate"].(map[string]interface{}); ok {
				year := int(extractFloat(startDate, "year"))
				month := int(extractFloat(startDate, "month"))
				if year > 0 {
					edu.StartDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
				}
			}

			if endDate, ok := education["endDate"].(map[string]interface{}); ok {
				year := int(extractFloat(endDate, "year"))
				month := int(extractFloat(endDate, "month"))
				if year > 0 {
					endTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
					edu.EndDate = &endTime
				}
			}

			educations = append(educations, edu)
		}
	}

	return educations
}

// convertLinkedInSkillsToResumeSkills converts LinkedIn skills to resume skills format
func (s *LinkedInService) convertLinkedInSkillsToResumeSkills(elements []interface{}) []models.Skill {
	var skills []models.Skill

	for _, element := range elements {
		if skill, ok := element.(map[string]interface{}); ok {
			resumeSkill := models.Skill{
				Name:     extractString(skill, "name"),
				Category: "Technical", // Default category
				Level:    3,           // Default level
			}
			skills = append(skills, resumeSkill)
		}
	}

	return skills
}

// convertLinkedInCertificationsToResumeCertifications converts LinkedIn certifications to resume format
func (s *LinkedInService) convertLinkedInCertificationsToResumeCertifications(elements []interface{}) []models.Certification {
	var certifications []models.Certification

	for _, element := range elements {
		if cert, ok := element.(map[string]interface{}); ok {
			certification := models.Certification{
				Name:   extractString(cert, "name"),
				Issuer: extractString(cert, "issuingOrganization"),
			}

			// Handle issue date
			if issueDate, ok := cert["issueDate"].(map[string]interface{}); ok {
				year := int(extractFloat(issueDate, "year"))
				month := int(extractFloat(issueDate, "month"))
				if year > 0 {
					certification.IssueDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
				}
			}

			certifications = append(certifications, certification)
		}
	}

	return certifications
}

// convertLinkedInLanguagesToResumeLanguages converts LinkedIn languages to resume format
func (s *LinkedInService) convertLinkedInLanguagesToResumeLanguages(elements []interface{}) []models.Language {
	var languages []models.Language

	for _, element := range elements {
		if lang, ok := element.(map[string]interface{}); ok {
			language := models.Language{
				Name:        extractString(lang, "name"),
				Proficiency: "Fluent", // Default proficiency
			}
			languages = append(languages, language)
		}
	}

	return languages
}

// convertLinkedInProjectsToResumeProjects converts LinkedIn projects to resume format
func (s *LinkedInService) convertLinkedInProjectsToResumeProjects(elements []interface{}) []models.Project {
	var projects []models.Project

	for _, element := range elements {
		if project, ok := element.(map[string]interface{}); ok {
			resumeProject := models.Project{
				Name:        extractString(project, "name"),
				Description: extractString(project, "description"),
			}

			// Handle dates
			if startDate, ok := project["startDate"].(map[string]interface{}); ok {
				year := int(extractFloat(startDate, "year"))
				month := int(extractFloat(startDate, "month"))
				if year > 0 {
					resumeProject.StartDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
				}
			}

			if endDate, ok := project["endDate"].(map[string]interface{}); ok {
				year := int(extractFloat(endDate, "year"))
				month := int(extractFloat(endDate, "month"))
				if year > 0 {
					endTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
					resumeProject.EndDate = &endTime
				}
			}

			projects = append(projects, resumeProject)
		}
	}

	return projects
}

// convertLinkedInHonorsToResumeAwards converts LinkedIn honors to resume awards format
func (s *LinkedInService) convertLinkedInHonorsToResumeAwards(elements []interface{}) []map[string]interface{} {
	var awards []map[string]interface{}

	for _, element := range elements {
		if honor, ok := element.(map[string]interface{}); ok {
			award := map[string]interface{}{
				"name":        extractString(honor, "name"),
				"issuer":      extractString(honor, "issuer"),
				"description": extractString(honor, "description"),
			}

			// Handle issue date
			if issueDate, ok := honor["issueDate"].(map[string]interface{}); ok {
				year := int(extractFloat(issueDate, "year"))
				month := int(extractFloat(issueDate, "month"))
				if year > 0 {
					award["issue_date"] = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
				}
			}

			awards = append(awards, award)
		}
	}

	return awards
}

// Helper function to extract boolean values
func extractBool(data map[string]interface{}, key string) bool {
	if value, ok := data[key]; ok {
		if b, ok := value.(bool); ok {
			return b
		}
	}
	return false
}

// RefreshAccessToken refreshes the LinkedIn access token
func (s *LinkedInService) RefreshAccessToken(refreshToken string) (*models.LinkedInAuthResponse, error) {
	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("refresh_token", refreshToken)
	data.Set("client_id", s.config.ClientID)
	data.Set("client_secret", s.config.ClientSecret)

	resp, err := http.PostForm("https://www.linkedin.com/oauth/v2/accessToken", data)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("token refresh failed: %s - %s", resp.Status, string(body))
	}

	var tokenResponse map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return nil, fmt.Errorf("failed to decode token response: %w", err)
	}

	return &models.LinkedInAuthResponse{
		AccessToken:  extractString(tokenResponse, "access_token"),
		RefreshToken: extractString(tokenResponse, "refresh_token"),
		ExpiresIn:    int(extractFloat(tokenResponse, "expires_in")),
		TokenType:    extractString(tokenResponse, "token_type"),
	}, nil
}

// SyncUserProfile syncs LinkedIn profile data and creates/updates resume for a user
func (s *LinkedInService) SyncUserProfile(userID uint) error {
	// Get LinkedIn auth for the user
	linkedInAuth := &models.LinkedInAuthModel{}
	if err := linkedInAuth.GetByUserID(userID); err != nil {
		return fmt.Errorf("LinkedIn authentication not found for user: %w", err)
	}

	// Check if token is expired and refresh if needed
	if time.Now().After(linkedInAuth.TokenExpiry) {
		refreshResponse, err := s.RefreshAccessToken(linkedInAuth.RefreshToken)
		if err != nil {
			return fmt.Errorf("failed to refresh token: %w", err)
		}

		linkedInAuth.AccessToken = refreshResponse.AccessToken
		linkedInAuth.RefreshToken = refreshResponse.RefreshToken
		linkedInAuth.TokenExpiry = time.Now().Add(time.Duration(refreshResponse.ExpiresIn) * time.Second)

		if err := linkedInAuth.Update(); err != nil {
			return fmt.Errorf("failed to update refreshed token: %w", err)
		}
	}

	// Fetch latest profile data and create resume
	resume, err := s.GetUserProfile(linkedInAuth.AccessToken)
	if err != nil {
		return fmt.Errorf("failed to fetch profile data: %w", err)
	}

	// Set user ID and create resume
	resume.UserID = userID
	if err := resume.Create(); err != nil {
		return fmt.Errorf("failed to create resume from LinkedIn data: %w", err)
	}

	return nil
}

// Helper functions
func extractString(data map[string]interface{}, key string) string {
	if value, ok := data[key]; ok {
		if str, ok := value.(string); ok {
			return str
		}
	}
	return ""
}

func extractFloat(data map[string]interface{}, key string) float64 {
	if value, ok := data[key]; ok {
		if f, ok := value.(float64); ok {
			return f
		}
	}
	return 0
}

// ExtractLinkedInID extracts LinkedIn ID from profile URL
func (s *LinkedInService) ExtractLinkedInID(profileURL string) string {
	if profileURL == "" {
		return ""
	}
	parts := strings.Split(profileURL, "/")
	if len(parts) > 0 {
		return parts[len(parts)-1]
	}
	return ""
}
