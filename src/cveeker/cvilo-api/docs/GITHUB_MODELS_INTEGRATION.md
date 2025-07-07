# GitHub Models Integration for Prototype Testing

## Overview

This integration allows you to use [GitHub Models](https://docs.github.com/en/github-models) for AI-powered resume generation during prototype testing. It provides access to GPT-4o and other models through GitHub's free tier, making it perfect for development and testing phases.

## Features

- **Free AI Models**: Access to GPT-4o and other models through GitHub Models
- **Seamless Integration**: Works alongside existing OpenAI integration
- **Easy Switching**: Toggle between GitHub Models and OpenAI via environment variables
- **Fallback Support**: Automatic fallback to OpenAI if GitHub Models fails
- **Prototype Testing**: Perfect for development and testing without costs

## Setup

### 1. Get GitHub Models API Key

1. Visit [GitHub Models Documentation](https://docs.github.com/en/github-models)
2. Follow the setup instructions to get your API key
3. Ensure you have access to the GPT-4o model

### 2. Configure Environment

#### Option A: Using Setup Script (Recommended)
```bash
cd cvilo-api
./setup_github_models_env.sh
```

#### Option B: Manual Configuration
Add these environment variables to your `.env` file:

```env
# GitHub Models Configuration
GITHUB_TOKEN=your_github_token_here  # Primary (as used in JavaScript example)
GITHUB_MODELS_API_KEY=your_github_models_api_key_here  # Fallback
GITHUB_MODELS_BASE_URL=https://models.github.ai/inference  # Optional, uses default if not set
USE_GITHUB_MODELS=true

# OpenAI Configuration (fallback)
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

### 3. Verify Configuration

Check the AI service status:
```bash
curl http://localhost:8081/api/ai/status
```

Expected response:
```json
{
  "status": "enabled",
  "message": "AI service status",
  "openai_configured": true,
  "github_models_configured": true,
  "active_provider": "github_models",
  "use_github_models": true
}
```

## Usage

### API Endpoints

All existing AI endpoints work with GitHub Models:

- `POST /api/ai/generate` - Generate new resume
- `POST /api/ai/update` - Update existing resume
- `GET /api/ai/status` - Check service status

### Request Format

The request format remains the same:

```json
{
  "prompt": "Create a backend developer resume with 5 years of experience in Node.js",
  "user_id": 1,
  "template": "modern",
  "theme": "blue"
}
```

### Response Format

The response format is identical to OpenAI:

```json
{
  "success": true,
  "message": "Resume generated successfully using GitHub Models",
  "data": {
    "resume": { /* resume data */ },
    "ai_response": { /* AI response data */ }
  }
}
```

## Switching Between Providers

### Enable GitHub Models (for prototype testing)
```bash
echo "USE_GITHUB_MODELS=true" >> .env
```

### Disable GitHub Models (use OpenAI)
```bash
echo "USE_GITHUB_MODELS=false" >> .env
```

### Check Current Provider
```bash
curl http://localhost:8081/api/ai/status | jq '.active_provider'
```

## Technical Implementation

### Service Architecture

```
AIController
├── AIService (OpenAI)
└── GitHubModelsService (GitHub Models)
    └── Uses GPT-4o model
```

### Provider Selection Logic

```go
if useGitHubModels && githubModelsService.IsConfigured() {
    // Use GitHub Models
    aiResponse, err = githubModelsService.GenerateResumeFromPrompt(request)
} else {
    // Use OpenAI
    aiResponse, err = aiService.GenerateResumeFromPrompt(request)
}
```

### Error Handling

- **GitHub Models Unavailable**: Falls back to OpenAI
- **Both Unavailable**: Returns error with clear message
- **Network Issues**: Retries with exponential backoff
- **Rate Limiting**: Respects GitHub Models rate limits

## Models Available

### GitHub Models
- **openai/gpt-4.1**: Primary model for resume generation (GPT-4.1 via GitHub Models)
- **Other models**: Available through GitHub Models platform

### OpenAI Models (Fallback)
- **GPT-4**: High-quality responses
- **GPT-3.5-turbo**: Faster, more cost-effective

## Cost Comparison

### GitHub Models (Free Tier)
- **GPT-4o**: Free for prototype testing
- **Rate Limits**: Generous limits for development
- **No Credit Card Required**: Perfect for testing

### OpenAI (Production)
- **GPT-4**: ~$0.03 per 1K tokens
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Requires Credits**: Need to add payment method

## Best Practices

### For Prototype Testing
1. **Use GitHub Models**: Set `USE_GITHUB_MODELS=true`
2. **Test Extensively**: Take advantage of free tier
3. **Monitor Rate Limits**: Stay within GitHub's limits
4. **Keep OpenAI as Fallback**: For reliability

### For Production
1. **Use OpenAI**: Set `USE_GITHUB_MODELS=false`
2. **Monitor Costs**: Track token usage
3. **Optimize Prompts**: Reduce token consumption
4. **Implement Caching**: Cache common responses

## Troubleshooting

### Common Issues

#### 1. GitHub Models Not Responding
```bash
# Check API key
echo $GITHUB_MODELS_API_KEY

# Check service status
curl http://localhost:8081/api/ai/status

# Check logs
tail -f logs/app.log
```

#### 2. Rate Limiting
```bash
# Check GitHub Models rate limits
curl -H "Authorization: Bearer $GITHUB_MODELS_API_KEY" \
     https://api.github.com/rate_limit
```

#### 3. Model Not Available
```bash
# Check available models
curl -H "Authorization: Bearer $GITHUB_MODELS_API_KEY" \
     https://api.github.com/models
```

### Error Messages

- **"GitHub Models API key not configured"**: Set `GITHUB_MODELS_API_KEY`
- **"Rate limit exceeded"**: Wait or switch to OpenAI
- **"Model not available"**: Check GitHub Models access
- **"Network timeout"**: Check internet connection

## Development Workflow

### 1. Setup Phase
```bash
# Clone repository
git clone <repo-url>
cd cvilo-api

# Setup GitHub Models
./setup_github_models_env.sh

# Start server
go run main.go
```

### 2. Testing Phase
```bash
# Test resume generation
curl -X POST http://localhost:8081/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a backend developer resume", "user_id": 1}'

# Test resume update
curl -X POST http://localhost:8081/api/ai/update \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Add Python experience", "user_id": 1, "resume_id": 1}'
```

### 3. Production Phase
```bash
# Switch to OpenAI
echo "USE_GITHUB_MODELS=false" >> .env

# Restart server
go run main.go
```

## Security Considerations

1. **API Key Protection**: Store keys in environment variables
2. **Rate Limiting**: Respect GitHub Models limits
3. **Input Validation**: Validate all prompts before sending
4. **Error Handling**: Don't expose sensitive information in errors
5. **Logging**: Log requests but not API keys

## Performance Optimization

1. **Connection Pooling**: Reuse HTTP connections
2. **Request Caching**: Cache similar requests
3. **Timeout Configuration**: Set appropriate timeouts
4. **Retry Logic**: Implement exponential backoff
5. **Response Streaming**: For large responses

## Future Enhancements

1. **Model Selection**: Allow users to choose specific models
2. **A/B Testing**: Compare different models
3. **Cost Optimization**: Automatic model selection based on cost
4. **Multi-Provider**: Support additional AI providers
5. **Response Quality**: Implement quality scoring

## Support

- **GitHub Models Documentation**: [https://docs.github.com/en/github-models](https://docs.github.com/en/github-models)
- **API Status**: `GET /api/ai/status`
- **Issues**: Create GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions 