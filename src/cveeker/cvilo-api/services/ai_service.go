package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/sashabaranov/go-openai"
	"github.com/smhnaqvi/cvilo/models"
)

type AIService struct {
	client *openai.Client
}

type AIResumeRequest struct {
	Prompt   string `json:"prompt"`
	UserID   uint   `json:"user_id"`
	ResumeID *uint  `json:"resume_id,omitempty"` // Optional: if updating existing resume
	Template string `json:"template,omitempty"`
	Theme    string `json:"theme,omitempty"`
}

type AIResumeResponse struct {
	FullName       string                  `json:"full_name"`
	Email          string                  `json:"email"`
	Phone          string                  `json:"phone"`
	Address        string                  `json:"address"`
	Website        string                  `json:"website"`
	LinkedIn       string                  `json:"linkedin"`
	GitHub         string                  `json:"github"`
	Summary        string                  `json:"summary"`
	Objective      string                  `json:"objective"`
	Experience     []models.WorkExperience `json:"experience"`
	Education      []models.Education      `json:"education"`
	Skills         []models.Skill          `json:"skills"`
	Languages      []models.Language       `json:"languages"`
	Certifications []models.Certification  `json:"certifications"`
	Projects       []models.Project        `json:"projects"`
	Awards         string                  `json:"awards"`
	Interests      string                  `json:"interests"`
	References     string                  `json:"references"`
	Template       string                  `json:"template"`
	Theme          string                  `json:"theme"`
}

func NewAIService() *AIService {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Println("Warning: OPENAI_API_KEY not set")
		return &AIService{client: nil}
	}

	client := openai.NewClient(apiKey)
	return &AIService{client: client}
}

func (ai *AIService) GenerateResumeFromPrompt(request AIResumeRequest) (*AIResumeResponse, error) {
	if ai.client == nil {
		return nil, fmt.Errorf("OpenAI client not initialized - check OPENAI_API_KEY")
	}

	// Create the system prompt
	systemPrompt := `You are an expert resume builder. Based on the user's prompt, create a comprehensive resume in JSON format. 

The response should be a valid JSON object with the following structure:
{
  "full_name": "string",
  "email": "string", 
  "phone": "string",
  "address": "string",
  "website": "string",
  "linkedin": "string",
  "github": "string",
  "summary": "string",
  "objective": "string",
  "experience": [
    {
      "company": "string",
      "position": "string", 
      "location": "string",
      "start_date": "2020-01-01T00:00:00Z",
      "end_date": "2023-01-01T00:00:00Z",
      "is_current": false,
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field_of_study": "string", 
      "location": "string",
      "start_date": "2020-01-01T00:00:00Z",
      "end_date": "2023-01-01T00:00:00Z",
      "gpa": "string",
      "description": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "string",
      "level": 5,
      "years_experience": 3
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issue_date": "2020-01-01T00:00:00Z",
      "expiry_date": "2023-01-01T00:00:00Z",
      "credential_id": "string",
      "url": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "start_date": "2020-01-01T00:00:00Z",
      "end_date": "2023-01-01T00:00:00Z",
      "url": "string",
      "github": "string"
    }
  ],
  "awards": "string",
  "interests": "string",
  "references": "string",
  "template": "modern",
  "theme": "blue"
}

Important guidelines:
1. Use realistic but professional information
2. Ensure all dates are in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
3. For current positions, set "is_current": true and omit "end_date"
4. For ongoing education, omit "end_date"
5. Skills should have levels 1-5 (1=beginner, 5=expert)
6. Use appropriate categories for skills (Technical, Languages, Soft Skills, etc.)
7. Make the resume comprehensive and professional
8. Ensure all JSON is valid and properly formatted`

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

	// Make the API call
	resp, err := ai.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
			Temperature: 0.7,
			MaxTokens:   4000,
		},
	)

	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %v", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("no response from OpenAI")
	}

	// Extract the JSON response
	content := resp.Choices[0].Message.Content

	// Clean up the response - remove markdown formatting if present
	content = strings.TrimSpace(content)
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
	}
	if strings.HasSuffix(content, "```") {
		content = strings.TrimSuffix(content, "```")
	}
	content = strings.TrimSpace(content)

	// Parse the JSON response
	var aiResponse AIResumeResponse
	if err := json.Unmarshal([]byte(content), &aiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %v\nResponse: %s", err, content)
	}

	// Set default template and theme if not provided
	if aiResponse.Template == "" {
		aiResponse.Template = "modern"
	}
	if aiResponse.Theme == "" {
		aiResponse.Theme = "blue"
	}

	return &aiResponse, nil
}

func (ai *AIService) UpdateResumeFromPrompt(request AIResumeRequest, existingResume models.ResumeModel) (*AIResumeResponse, error) {
	if ai.client == nil {
		return nil, fmt.Errorf("OpenAI client not initialized - check OPENAI_API_KEY")
	}

	// Create the system prompt for updating
	systemPrompt := `You are an expert resume builder. Based on the user's prompt and the existing resume, update the resume in JSON format.

The response should be a valid JSON object with the same structure as before, but you should:
1. Keep relevant existing information that doesn't conflict with the new prompt
2. Update or add information based on the user's prompt
3. Maintain the professional quality and consistency

Return the complete updated resume in JSON format.`

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

	// Make the API call
	resp, err := ai.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
			Temperature: 0.7,
			MaxTokens:   4000,
		},
	)

	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %v", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("no response from OpenAI")
	}

	// Extract and parse the JSON response
	content := resp.Choices[0].Message.Content
	content = strings.TrimSpace(content)
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
	}
	if strings.HasSuffix(content, "```") {
		content = strings.TrimSuffix(content, "```")
	}
	content = strings.TrimSpace(content)

	var aiResponse AIResumeResponse
	if err := json.Unmarshal([]byte(content), &aiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %v\nResponse: %s", err, content)
	}

	return &aiResponse, nil
}

// Helper function to convert AI response to ResumeModel
func (ai *AIService) ConvertAIResponseToResume(aiResponse *AIResumeResponse, userID uint, title string) (*models.ResumeModel, error) {
	// Convert arrays to JSON strings
	experienceJSON, err := json.Marshal(aiResponse.Experience)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal experience: %v", err)
	}

	educationJSON, err := json.Marshal(aiResponse.Education)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal education: %v", err)
	}

	skillsJSON, err := json.Marshal(aiResponse.Skills)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal skills: %v", err)
	}

	languagesJSON, err := json.Marshal(aiResponse.Languages)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal languages: %v", err)
	}

	certificationsJSON, err := json.Marshal(aiResponse.Certifications)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal certifications: %v", err)
	}

	projectsJSON, err := json.Marshal(aiResponse.Projects)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal projects: %v", err)
	}

	resume := &models.ResumeModel{
		UserID:         userID,
		Title:          title,
		FullName:       aiResponse.FullName,
		Email:          aiResponse.Email,
		Phone:          aiResponse.Phone,
		Address:        aiResponse.Address,
		Website:        aiResponse.Website,
		LinkedIn:       aiResponse.LinkedIn,
		GitHub:         aiResponse.GitHub,
		Summary:        aiResponse.Summary,
		Objective:      aiResponse.Objective,
		Experience:     string(experienceJSON),
		Education:      string(educationJSON),
		Skills:         string(skillsJSON),
		Languages:      string(languagesJSON),
		Certifications: string(certificationsJSON),
		Projects:       string(projectsJSON),
		Awards:         aiResponse.Awards,
		Interests:      aiResponse.Interests,
		References:     aiResponse.References,
		Template:       aiResponse.Template,
		Theme:          aiResponse.Theme,
		IsActive:       true,
	}

	return resume, nil
}

// IsConfigured returns true if the AI service is properly configured
func (ai *AIService) IsConfigured() bool {
	return ai.client != nil
}
