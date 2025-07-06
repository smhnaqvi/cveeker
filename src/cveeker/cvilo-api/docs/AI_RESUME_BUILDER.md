# AI Resume Builder Documentation

## Overview

The AI Resume Builder is a powerful feature that allows users to generate and update resumes using natural language prompts. It leverages OpenAI's GPT-4 model to create professional, comprehensive resumes based on user descriptions.

## Features

- **Natural Language Processing**: Convert text prompts into structured resume data
- **Smart Resume Generation**: Create complete resumes with all sections (experience, education, skills, etc.)
- **Resume Updates**: Update existing resumes based on new prompts
- **Template & Theme Support**: Specify preferred resume templates and themes
- **JSON Response**: Structured data output for easy integration
- **User Validation**: Ensure users can only modify their own resumes

## Setup

### 1. Install Dependencies

The OpenAI Go client is already included in the project:

```bash
go get github.com/sashabaranov/go-openai
```

### 2. Configure OpenAI API

Run the setup script to configure your OpenAI API key:

```bash
./setup_openai_env.sh
```

Or manually add to your `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Restart the Server

```bash
go run main.go
```

## API Endpoints

### 1. Check AI Service Status

**GET** `/api/v1/ai/status`

Check if the AI service is properly configured.

**Response:**
```json
{
  "status": "enabled",
  "message": "AI service status",
  "openai_configured": true
}
```

### 2. Generate New Resume

**POST** `/api/v1/ai/generate`

Generate a new resume from a text prompt.

**Request Body:**
```json
{
  "prompt": "Create a resume for a senior software engineer with 5 years of experience in Go and React",
  "user_id": 1,
  "template": "modern",
  "theme": "blue"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume generated successfully using AI",
  "data": {
    "resume": {
      "id": 1,
      "user_id": 1,
      "title": "AI Generated Resume - 2024-01-15 14:30",
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0123",
      "summary": "Senior Software Engineer with 5 years of experience...",
      "experience": "[{\"company\":\"Tech Corp\",\"position\":\"Senior Software Engineer\"...}]",
      "education": "[{\"institution\":\"University of Technology\",\"degree\":\"Bachelor of Science\"...}]",
      "skills": "[{\"name\":\"Go\",\"category\":\"Programming\",\"level\":5,\"years_experience\":3}...]",
      "template": "modern",
      "theme": "blue",
      "is_active": true,
      "created_at": "2024-01-15T14:30:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    },
    "ai_response": {
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "experience": [...],
      "education": [...],
      "skills": [...]
    }
  }
}
```

### 3. Update Existing Resume

**POST** `/api/v1/ai/update`

Update an existing resume based on a text prompt.

**Request Body:**
```json
{
  "prompt": "Add more emphasis on cloud technologies and update the summary to focus on DevOps experience",
  "user_id": 1,
  "resume_id": 1,
  "template": "modern",
  "theme": "blue"
}
```

### 4. Generate Resume for Specific User

**POST** `/api/v1/ai/users/:user_id/generate`

Alternative endpoint for generating resumes with user ID in URL.

**Request Body:**
```json
{
  "prompt": "Create a resume for a data scientist with Python and machine learning experience",
  "template": "classic",
  "theme": "green"
}
```

### 5. Update Specific Resume

**POST** `/api/v1/ai/users/:user_id/resumes/:resume_id/update`

Alternative endpoint for updating resumes with IDs in URL.

**Request Body:**
```json
{
  "prompt": "Add a new project section and update the skills to include TensorFlow and PyTorch"
}
```

## Prompt Examples

### Basic Resume Generation
```
"Create a resume for a junior web developer with 2 years of experience in JavaScript and React"
```

### Specific Role Focus
```
"Generate a resume for a product manager with experience in agile methodologies and user research"
```

### Industry-Specific
```
"Create a resume for a marketing specialist with experience in digital marketing, social media, and content creation"
```

### Update Existing Resume
```
"Add more technical skills and update the experience section to highlight leadership roles"
```

### Template and Theme Specification
```
"Create a modern resume for a UX designer with a blue theme, focusing on user research and prototyping skills"
```

## AI Response Structure

The AI service returns structured JSON data with the following format:

```json
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
```

## Error Handling

### Common Errors

1. **OpenAI API Key Not Set**
   ```json
   {
     "error": "OpenAI client not initialized - check OPENAI_API_KEY"
   }
   ```

2. **Invalid Request**
   ```json
   {
     "error": "Prompt and user_id are required"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": "User not found"
   }
   ```

4. **Resume Not Found**
   ```json
   {
     "error": "Resume not found"
   }
   ```

5. **Permission Denied**
   ```json
   {
     "error": "You can only update your own resumes"
   }
   ```

## Testing

### Test AI Service Status
```bash
curl http://localhost:8081/api/v1/ai/status
```

### Test Resume Generation
```bash
curl -X POST http://localhost:8081/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a resume for a software engineer with Go and React experience",
    "user_id": 1,
    "template": "modern",
    "theme": "blue"
  }'
```

### Test Resume Update
```bash
curl -X POST http://localhost:8081/api/v1/ai/update \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Add more emphasis on cloud technologies",
    "user_id": 1,
    "resume_id": 1
  }'
```

## Best Practices

1. **Clear Prompts**: Be specific about the role, experience level, and key skills
2. **Template Consistency**: Use consistent templates and themes across resumes
3. **User Validation**: Always verify user ownership before updates
4. **Error Handling**: Implement proper error handling for API failures
5. **Rate Limiting**: Consider implementing rate limiting for AI endpoints
6. **Cost Management**: Monitor OpenAI API usage and costs

## Security Considerations

1. **API Key Protection**: Never expose OpenAI API keys in client-side code
2. **User Authorization**: Verify user permissions for all operations
3. **Input Validation**: Validate all user inputs before processing
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Logging**: Log AI operations for monitoring and debugging

## Troubleshooting

### AI Service Not Working
1. Check if `OPENAI_API_KEY` is set in `.env`
2. Verify the API key is valid and has sufficient credits
3. Check server logs for detailed error messages

### Poor Resume Quality
1. Provide more detailed prompts
2. Specify industry and role clearly
3. Include key skills and technologies in the prompt

### API Timeouts
1. Increase timeout settings if needed
2. Check OpenAI API status
3. Consider using a different model (GPT-3.5-turbo for faster responses)

## Integration with Frontend

The AI resume builder can be easily integrated with the existing frontend:

1. Add AI generation buttons to the resume creation flow
2. Implement a prompt input form
3. Show loading states during AI processing
4. Display the generated resume for review before saving
5. Allow users to edit AI-generated content

## Future Enhancements

1. **Multiple AI Models**: Support for different AI models (GPT-3.5, Claude, etc.)
2. **Custom Prompts**: Save and reuse custom prompt templates
3. **Batch Processing**: Generate multiple resume variations
4. **Smart Suggestions**: AI-powered resume improvement suggestions
5. **Industry Templates**: Pre-built prompts for specific industries
6. **Resume Scoring**: AI-powered resume quality scoring 