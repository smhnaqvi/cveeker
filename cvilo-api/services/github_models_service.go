package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/smhnaqvi/cvilo/models"
)

// GitHubModelsService handles interactions with GitHub Models API
type GitHubModelsService struct {
	client *http.Client
	apiURL string
	apiKey string
	model  string
}

// GitHubModelsRequest represents the request structure for GitHub Models API
type GitHubModelsRequest struct {
	Model       string                `json:"model"`
	Messages    []GitHubModelsMessage `json:"messages"`
	Temperature float64               `json:"temperature"`
	TopP        float64               `json:"top_p"`
}

// GitHubModelsMessage represents a message in the conversation
type GitHubModelsMessage struct {
	Role      string                 `json:"role"`
	Content   string                 `json:"content"`
	ToolCalls []GitHubModelsToolCall `json:"tool_calls,omitempty"`
}

// GitHubModelsTool represents a tool that can be used by the model
type GitHubModelsTool struct {
	Type     string                   `json:"type"`
	Function GitHubModelsToolFunction `json:"function,omitempty"`
}

// GitHubModelsToolFunction represents a function tool
type GitHubModelsToolFunction struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters"`
}

// GitHubModelsToolChoice represents tool choice configuration
type GitHubModelsToolChoice struct {
	Type     string                    `json:"type"`
	Function *GitHubModelsToolFunction `json:"function,omitempty"`
}

// GitHubModelsToolCall represents a tool call made by the model
type GitHubModelsToolCall struct {
	ID       string                   `json:"id"`
	Type     string                   `json:"type"`
	Function GitHubModelsToolCallFunc `json:"function"`
}

// GitHubModelsToolCallFunc represents the function call details
type GitHubModelsToolCallFunc struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

// GitHubModelsResponse represents the response from GitHub Models API
type GitHubModelsResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// Flexible response structure to handle different AI response formats
type FlexibleAIResponse struct {
	// Standard fields
	FullName   string `json:"full_name,omitempty"`
	Email      string `json:"email,omitempty"`
	Phone      string `json:"phone,omitempty"`
	Address    string `json:"address,omitempty"`
	Website    string `json:"website,omitempty"`
	LinkedIn   string `json:"linkedin,omitempty"`
	GitHub     string `json:"github,omitempty"`
	Summary    string `json:"summary,omitempty"`
	Objective  string `json:"objective,omitempty"`
	Template   string `json:"template,omitempty"`
	Theme      string `json:"theme,omitempty"`
	Awards     string `json:"awards,omitempty"`
	Interests  string `json:"interests,omitempty"`
	References string `json:"references,omitempty"`

	// Alternative field names (GitHub Models format)
	FullNameAlt string `json:"Full Name,omitempty"`
	EmailAlt    string `json:"Email,omitempty"`
	PhoneAlt    string `json:"Phone,omitempty"`
	SummaryAlt  string `json:"Summary,omitempty"`

	// Experience - handle both formats
	Experience    []models.WorkExperience `json:"experience,omitempty"`
	ExperienceAlt []FlexibleExperience    `json:"Experience,omitempty"`

	// Education - handle both formats
	Education    []models.Education  `json:"education,omitempty"`
	EducationAlt []FlexibleEducation `json:"Education,omitempty"`

	// Skills - handle both formats
	Skills    []models.Skill `json:"skills,omitempty"`
	SkillsAlt []string       `json:"Skills,omitempty"`

	// Other sections
	Languages      []models.Language      `json:"languages,omitempty"`
	Certifications []models.Certification `json:"certifications,omitempty"`
	Projects       []models.Project       `json:"projects,omitempty"`
}

// Flexible structures for GitHub Models format
type FlexibleExperience struct {
	JobTitle         string   `json:"Job Title,omitempty"`
	Company          string   `json:"Company,omitempty"`
	Location         string   `json:"Location,omitempty"`
	StartDate        string   `json:"Start Date,omitempty"`
	EndDate          string   `json:"End Date,omitempty"`
	Responsibilities []string `json:"Responsibilities,omitempty"`
}

type FlexibleEducation struct {
	Degree      string `json:"Degree,omitempty"`
	Institution string `json:"Institution,omitempty"`
	Location    string `json:"Location,omitempty"`
	StartDate   string `json:"Start Date,omitempty"`
	EndDate     string `json:"End Date,omitempty"`
}

// NewGitHubModelsService creates a new GitHub Models service instance
func NewGitHubModelsService() *GitHubModelsService {
	apiKey := os.Getenv("GITHUB_TOKEN")
	if apiKey == "" {
		log.Println("Warning: GITHUB_TOKEN not set for GitHub Models")
		return &GitHubModelsService{
			client: &http.Client{Timeout: 30 * time.Second},
			apiURL: "https://models.github.ai/inference",
			model:  "openai/gpt-4.1",
		}
	}

	return &GitHubModelsService{
		client: &http.Client{Timeout: 30 * time.Second},
		apiURL: "https://models.github.ai/inference",
		apiKey: apiKey,
		model:  "openai/gpt-4.1",
	}
}

// GenerateResumeFromPrompt generates a resume using GitHub Models GPT-4o
func (gms *GitHubModelsService) GenerateResumeFromPrompt(request AIResumeRequest) (*AIResumeResponse, error) {
	if !gms.IsConfigured() {
		return nil, fmt.Errorf("GitHub Models not configured - check GITHUB_TOKEN")
	}

	// Create the system prompt
	systemPrompt := `You are an expert resume builder. Based on the user's prompt, create a comprehensive resume in JSON format. 

The response should be a valid JSON object with the following structure:
{
  "Full Name": "string",
  "Email": "string", 
  "Phone": "string",
  "Summary": "string",
  "Experience": [
    {
      "Job Title": "string",
      "Company": "string", 
      "Location": "string",
      "Start Date": "string",
      "End Date": "string",
      "Responsibilities": ["string"]
    }
  ],
  "Education": [
    {
      "Degree": "string",
      "Institution": "string", 
      "Location": "string",
      "Start Date": "string",
      "End Date": "string"
    }
  ],
  "Skills": ["string"]

Important guidelines:
1. Use realistic but professional information
2. Make the resume comprehensive and professional
3. Ensure all JSON is valid and properly formatted
4. Use the exact field names shown above
5. For current positions, use "Present" as End Date
6. Make skills a simple array of strings`

	// Create user prompt with context
	userPrompt := fmt.Sprintf(`Create a professional resume based on this prompt: "%s"

Additional context:
- Template preference: %s
- Theme preference: %s
- This is for user ID: %d

Please generate a complete, professional resume in the exact JSON format specified.`,
		request.Prompt,
		request.Template,
		request.Theme,
		request.UserID)

	// Prepare the request
	reqBody := GitHubModelsRequest{
		Model: gms.model,
		Messages: []GitHubModelsMessage{
			{
				Role:    "system",
				Content: systemPrompt,
			},
			{
				Role:    "user",
				Content: userPrompt,
			},
		},
		Temperature: 0.7,
		TopP:        0.9,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %v", err)
	}

	// Make the API call
	req, err := http.NewRequest("POST", gms.apiURL+"/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+gms.apiKey)

	resp, err := gms.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GitHub Models API request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GitHub Models API error: %d - %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var githubResp GitHubModelsResponse
	if err := json.NewDecoder(resp.Body).Decode(&githubResp); err != nil {
		return nil, fmt.Errorf("failed to decode GitHub Models response: %v", err)
	}

	if len(githubResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from GitHub Models")
	}

	// Extract the content
	content := githubResp.Choices[0].Message.Content

	// Clean up the response - remove markdown formatting if present
	content = strings.TrimSpace(content)
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
	}
	if strings.HasSuffix(content, "```") {
		content = strings.TrimSuffix(content, "```")
	}
	content = strings.TrimSpace(content)

	// Parse the flexible response
	var flexibleResp FlexibleAIResponse
	if err := json.Unmarshal([]byte(content), &flexibleResp); err != nil {
		return nil, fmt.Errorf("failed to parse GitHub Models response: %v\nResponse: %s", err, content)
	}

	// Convert flexible response to standard AIResumeResponse
	return gms.convertFlexibleToStandard(&flexibleResp), nil
}

// UpdateResumeFromPrompt updates an existing resume using GitHub Models
func (gms *GitHubModelsService) UpdateResumeFromPrompt(request AIResumeRequest, existingResume models.ResumeModel) (*AIResumeResponse, error) {
	if !gms.IsConfigured() {
		return nil, fmt.Errorf("GitHub Models not configured - check GITHUB_TOKEN")
	}

	// Create the system prompt for updating
	systemPrompt := `You are an expert resume builder. Based on the user's prompt and the existing resume, update the resume in JSON format.

The response should be a valid JSON object with the following structure:
{
  "Full Name": "string",
  "Email": "string", 
  "Phone": "string",
  "Summary": "string",
  "Experience": [
    {
      "Job Title": "string",
      "Company": "string", 
      "Location": "string",
      "Start Date": "string",
      "End Date": "string",
      "Responsibilities": ["string"]
    }
  ],
  "Education": [
    {
      "Degree": "string",
      "Institution": "string", 
      "Location": "string",
      "Start Date": "string",
      "End Date": "string"
    }
  ],
  "Skills": ["string"]

You should:
1. Keep relevant existing information that doesn't conflict with the new prompt
2. Update or add information based on the user's prompt
3. Maintain the professional quality and consistency
4. Use the exact field names shown above`

	// Create user prompt with existing resume context
	userPrompt := fmt.Sprintf(`Update this resume based on the prompt: "%s"

Existing resume information:
- Full Name: %s
- Email: %s
- Phone: %s
- Summary: %s
- Experience: %s
- Education: %s
- Skills: %s

Please update the resume according to the prompt while maintaining professional quality. Return the complete updated resume in JSON format.`,
		request.Prompt,
		existingResume.FullName,
		existingResume.Email,
		existingResume.Phone,
		existingResume.Summary,
		existingResume.Experience,
		existingResume.Education,
		existingResume.Skills)

	// Prepare the request
	reqBody := GitHubModelsRequest{
		Model: gms.model,
		Messages: []GitHubModelsMessage{
			{
				Role:    "system",
				Content: systemPrompt,
			},
			{
				Role:    "user",
				Content: userPrompt,
			},
		},
		Temperature: 0.7,
		TopP:        0.9,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %v", err)
	}

	// Make the API call
	req, err := http.NewRequest("POST", gms.apiURL+"/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+gms.apiKey)

	resp, err := gms.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GitHub Models API request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GitHub Models API error: %d - %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var githubResp GitHubModelsResponse
	if err := json.NewDecoder(resp.Body).Decode(&githubResp); err != nil {
		return nil, fmt.Errorf("failed to decode GitHub Models response: %v", err)
	}

	if len(githubResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from GitHub Models")
	}

	// Extract the content
	content := githubResp.Choices[0].Message.Content

	// Clean up the response - remove markdown formatting if present
	content = strings.TrimSpace(content)
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
	}
	if strings.HasSuffix(content, "```") {
		content = strings.TrimSuffix(content, "```")
	}
	content = strings.TrimSpace(content)

	// Parse the flexible response
	var flexibleResp FlexibleAIResponse
	if err := json.Unmarshal([]byte(content), &flexibleResp); err != nil {
		return nil, fmt.Errorf("failed to parse GitHub Models response: %v\nResponse: %s", err, content)
	}

	// Convert flexible response to standard AIResumeResponse
	return gms.convertFlexibleToStandard(&flexibleResp), nil
}

// convertFlexibleToStandard converts the flexible response format to our standard AIResumeResponse
func (gms *GitHubModelsService) convertFlexibleToStandard(flexible *FlexibleAIResponse) *AIResumeResponse {
	response := &AIResumeResponse{
		Template: "modern",
		Theme:    "blue",
	}

	// Handle personal information with fallbacks
	if flexible.FullName != "" {
		response.FullName = flexible.FullName
	} else if flexible.FullNameAlt != "" {
		response.FullName = flexible.FullNameAlt
	}

	if flexible.Email != "" {
		response.Email = flexible.Email
	} else if flexible.EmailAlt != "" {
		response.Email = flexible.EmailAlt
	}

	if flexible.Phone != "" {
		response.Phone = flexible.Phone
	} else if flexible.PhoneAlt != "" {
		response.Phone = flexible.PhoneAlt
	}

	if flexible.Summary != "" {
		response.Summary = flexible.Summary
	} else if flexible.SummaryAlt != "" {
		response.Summary = flexible.SummaryAlt
	}

	// Handle other fields
	response.Address = flexible.Address
	response.Website = flexible.Website
	response.LinkedIn = flexible.LinkedIn
	response.GitHub = flexible.GitHub
	response.Objective = flexible.Objective
	response.Awards = flexible.Awards
	response.Interests = flexible.Interests
	response.References = flexible.References

	// Handle experience
	if len(flexible.Experience) > 0 {
		response.Experience = flexible.Experience
	} else if len(flexible.ExperienceAlt) > 0 {
		response.Experience = gms.convertFlexibleExperience(flexible.ExperienceAlt)
	}

	// Handle education
	if len(flexible.Education) > 0 {
		response.Education = flexible.Education
	} else if len(flexible.EducationAlt) > 0 {
		response.Education = gms.convertFlexibleEducation(flexible.EducationAlt)
	}

	// Handle skills
	if len(flexible.Skills) > 0 {
		response.Skills = flexible.Skills
	} else if len(flexible.SkillsAlt) > 0 {
		response.Skills = gms.convertFlexibleSkills(flexible.SkillsAlt)
	}

	// Handle other sections
	response.Languages = flexible.Languages
	response.Certifications = flexible.Certifications
	response.Projects = flexible.Projects

	return response
}

// convertFlexibleExperience converts GitHub Models experience format to our format
func (gms *GitHubModelsService) convertFlexibleExperience(flexibleExp []FlexibleExperience) []models.WorkExperience {
	var experience []models.WorkExperience

	for _, exp := range flexibleExp {
		// Parse dates
		startDate := gms.parseDate(exp.StartDate)
		var endDate *time.Time
		if exp.EndDate != "" && exp.EndDate != "Present" {
			parsedEndDate := gms.parseDate(exp.EndDate)
			endDate = &parsedEndDate
		}

		// Convert responsibilities to description
		description := ""
		if len(exp.Responsibilities) > 0 {
			description = strings.Join(exp.Responsibilities, "\n• ")
			description = "• " + description
		}

		workExp := models.WorkExperience{
			Company:     exp.Company,
			Position:    exp.JobTitle,
			Location:    exp.Location,
			StartDate:   startDate,
			EndDate:     endDate,
			IsCurrent:   exp.EndDate == "Present",
			Description: description,
		}

		experience = append(experience, workExp)
	}

	return experience
}

// convertFlexibleEducation converts GitHub Models education format to our format
func (gms *GitHubModelsService) convertFlexibleEducation(flexibleEdu []FlexibleEducation) []models.Education {
	var education []models.Education

	for _, edu := range flexibleEdu {
		// Parse dates
		startDate := gms.parseDate(edu.StartDate)
		var endDate *time.Time
		if edu.EndDate != "" {
			parsedEndDate := gms.parseDate(edu.EndDate)
			endDate = &parsedEndDate
		}

		eduModel := models.Education{
			Institution:  edu.Institution,
			Degree:       edu.Degree,
			FieldOfStudy: edu.Degree, // Use degree as field of study
			Location:     edu.Location,
			StartDate:    startDate,
			EndDate:      endDate,
		}

		education = append(education, eduModel)
	}

	return education
}

// convertFlexibleSkills converts GitHub Models skills format to our format
func (gms *GitHubModelsService) convertFlexibleSkills(skillStrings []string) []models.Skill {
	var skills []models.Skill

	for _, skillName := range skillStrings {
		skill := models.Skill{
			Name:     skillName,
			Category: "Technical", // Default category
			Level:    4,           // Default level
		}
		skills = append(skills, skill)
	}

	return skills
}

// parseDate attempts to parse various date formats
func (gms *GitHubModelsService) parseDate(dateStr string) time.Time {
	// Try different date formats
	formats := []string{
		"2006-01-02",
		"January 2006",
		"Jan 2006",
		"2006",
		"2006-01",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t
		}
	}

	// If all parsing fails, return current time
	return time.Now()
}

// IsConfigured returns true if the GitHub Models service is properly configured
func (gms *GitHubModelsService) IsConfigured() bool {
	return gms.apiKey != ""
}

// GetModelInfo returns information about available models
func (gms *GitHubModelsService) GetModelInfo() (map[string]interface{}, error) {
	if gms.apiKey == "" {
		return nil, fmt.Errorf("GitHub Models API key not configured")
	}

	req, err := http.NewRequest("GET", gms.apiURL+"/models", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+gms.apiKey)
	req.Header.Set("User-Agent", "cvilo-resume-builder/1.0")

	resp, err := gms.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub Models API returned status %d: %s", resp.StatusCode, string(body))
	}

	var modelsInfo map[string]interface{}
	if err := json.Unmarshal(body, &modelsInfo); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %v", err)
	}

	return modelsInfo, nil
}
