package services

import (
	"encoding/json"
	"fmt"
	"io"
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

	if clientID == "" || clientSecret == "" || redirectURL == "" {
		panic("LinkedIn OAuth credentials not configured. Please set LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, and LINKEDIN_REDIRECT_URL environment variables.")
	}

	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes: []string{
			"r_liteprofile",
			"r_emailaddress",
			"r_basicprofile",
			"w_member_social",
		},
		Endpoint: linkedin.Endpoint,
	}

	return &LinkedInService{
		config: config,
	}
}

// GetAuthURL generates the LinkedIn OAuth authorization URL
func (s *LinkedInService) GetAuthURL(state string) string {
	return s.config.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

// ExchangeCodeForToken exchanges authorization code for access token
func (s *LinkedInService) ExchangeCodeForToken(code string) (*models.LinkedInAuthResponse, error) {
	token, err := s.config.Exchange(oauth2.NoContext, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code for token: %w", err)
	}

	return &models.LinkedInAuthResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    int(token.Expiry.Sub(time.Now()).Seconds()),
		TokenType:    token.TokenType,
	}, nil
}

// GetUserProfile fetches the user's LinkedIn profile data and converts it to resume format
func (s *LinkedInService) GetUserProfile(accessToken string) (*models.ResumeModel, error) {
	// First, get basic profile information
	profileURL := "https://api.linkedin.com/v2/me"
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

	var profileData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&profileData); err != nil {
		return nil, fmt.Errorf("failed to decode profile response: %w", err)
	}

	// Create resume from LinkedIn profile data
	resume := &models.ResumeModel{
		Title:    "LinkedIn Profile Resume",
		IsActive: true,
		Template: "modern",
		Theme:    "blue",
	}

	// Extract basic profile information
	firstName := extractString(profileData, "localizedFirstName")
	lastName := extractString(profileData, "localizedLastName")
	profileURLStr := fmt.Sprintf("https://www.linkedin.com/in/%s", extractString(profileData, "vanityName"))

	resume.FullName = firstName + " " + lastName
	resume.LinkedIn = profileURLStr

	// Get additional profile information and populate resume
	if err := s.populateResumeFromLinkedIn(resume, accessToken); err != nil {
		return nil, fmt.Errorf("failed to populate resume from LinkedIn: %w", err)
	}

	return resume, nil
}

// populateResumeFromLinkedIn fetches additional profile information and populates resume
func (s *LinkedInService) populateResumeFromLinkedIn(resume *models.ResumeModel, accessToken string) error {
	// Get profile with additional fields
	profileURL := "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams),headline,summary,location,industry,positions,educations,skills,certifications,languages,volunteer,publications,projects,honors,organizations)"

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

	// Extract positions (experience) and convert to resume format
	if positions, ok := detailedProfile["positions"].(map[string]interface{}); ok {
		if elements, ok := positions["elements"].([]interface{}); ok {
			experience := s.convertLinkedInPositionsToResumeExperience(elements)
			experienceData, _ := json.Marshal(experience)
			resume.Experience = string(experienceData)
		}
	}

	// Extract education and convert to resume format
	if educations, ok := detailedProfile["educations"].(map[string]interface{}); ok {
		if elements, ok := educations["elements"].([]interface{}); ok {
			education := s.convertLinkedInEducationToResumeEducation(elements)
			educationData, _ := json.Marshal(education)
			resume.Education = string(educationData)
		}
	}

	// Extract skills and convert to resume format
	if skills, ok := detailedProfile["skills"].(map[string]interface{}); ok {
		if elements, ok := skills["elements"].([]interface{}); ok {
			resumeSkills := s.convertLinkedInSkillsToResumeSkills(elements)
			skillsData, _ := json.Marshal(resumeSkills)
			resume.Skills = string(skillsData)
		}
	}

	// Extract certifications and convert to resume format
	if certifications, ok := detailedProfile["certifications"].(map[string]interface{}); ok {
		if elements, ok := certifications["elements"].([]interface{}); ok {
			certifications := s.convertLinkedInCertificationsToResumeCertifications(elements)
			certificationsData, _ := json.Marshal(certifications)
			resume.Certifications = string(certificationsData)
		}
	}

	// Extract languages and convert to resume format
	if languages, ok := detailedProfile["languages"].(map[string]interface{}); ok {
		if elements, ok := languages["elements"].([]interface{}); ok {
			languages := s.convertLinkedInLanguagesToResumeLanguages(elements)
			languagesData, _ := json.Marshal(languages)
			resume.Languages = string(languagesData)
		}
	}

	// Extract projects and convert to resume format
	if projects, ok := detailedProfile["projects"].(map[string]interface{}); ok {
		if elements, ok := projects["elements"].([]interface{}); ok {
			projects := s.convertLinkedInProjectsToResumeProjects(elements)
			projectsData, _ := json.Marshal(projects)
			resume.Projects = string(projectsData)
		}
	}

	// Extract honors/awards and convert to resume format
	if honors, ok := detailedProfile["honors"].(map[string]interface{}); ok {
		if elements, ok := honors["elements"].([]interface{}); ok {
			awards := s.convertLinkedInHonorsToResumeAwards(elements)
			awardsData, _ := json.Marshal(awards)
			resume.Awards = string(awardsData)
		}
	}

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
