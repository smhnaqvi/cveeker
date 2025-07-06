# AI Resume Builder - Quick Start Guide

## 🚀 Quick Setup

### 1. Configure OpenAI API
```bash
./setup_openai_env.sh
```

### 2. Start the Server
```bash
go run main.go
```

### 3. Test the AI Service
```bash
curl http://localhost:8081/api/v1/ai/status
```

## 📝 Usage Examples

### Generate a New Resume
```bash
curl -X POST http://localhost:8081/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a resume for a senior software engineer with 5 years of experience in Go and React",
    "user_id": 1,
    "template": "modern",
    "theme": "blue"
  }'
```

### Update Existing Resume
```bash
curl -X POST http://localhost:8081/api/v1/ai/update \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Add more emphasis on cloud technologies and DevOps experience",
    "user_id": 1,
    "resume_id": 1
  }'
```

### Generate Resume for Specific User
```bash
curl -X POST http://localhost:8081/api/v1/ai/users/1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a resume for a data scientist with Python and machine learning experience",
    "template": "classic",
    "theme": "green"
  }'
```

## 🎯 Prompt Examples

### Software Engineer
```
"Create a resume for a senior software engineer with 5 years of experience in Go, React, and cloud technologies"
```

### Data Scientist
```
"Generate a resume for a data scientist with experience in Python, machine learning, and statistical analysis"
```

### Product Manager
```
"Create a resume for a product manager with experience in agile methodologies, user research, and product strategy"
```

### Marketing Specialist
```
"Generate a resume for a marketing specialist with experience in digital marketing, social media, and content creation"
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ai/status` | Check AI service status |
| POST | `/api/v1/ai/generate` | Generate new resume |
| POST | `/api/v1/ai/update` | Update existing resume |
| POST | `/api/v1/ai/users/:user_id/generate` | Generate resume for user |
| POST | `/api/v1/ai/users/:user_id/resumes/:resume_id/update` | Update specific resume |

## 📚 Documentation

For detailed documentation, see: [AI_RESUME_BUILDER.md](docs/AI_RESUME_BUILDER.md)

## 🧪 Testing

Run the example script:
```bash
go run examples/ai_resume_example.go
```

## ⚠️ Troubleshooting

1. **AI service not configured**: Set `OPENAI_API_KEY` in your `.env` file
2. **API errors**: Check your OpenAI account for credits and API limits
3. **Poor results**: Provide more detailed and specific prompts

## 🎨 Features

- ✅ Natural language to structured resume data
- ✅ Complete resume generation (experience, education, skills, etc.)
- ✅ Resume updates and modifications
- ✅ Template and theme support
- ✅ User validation and security
- ✅ JSON response format
- ✅ Error handling and validation 