#!/bin/bash

# OpenAI API Environment Setup Script
# This script helps you set up the required environment variables for OpenAI API

echo "=== OpenAI API Environment Setup ==="
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "Found existing .env file"
    echo "Current OpenAI configuration:"
    grep -E "OPENAI_" .env || echo "No OpenAI variables found in .env"
    echo ""
fi

echo "Please provide the following OpenAI API credentials:"
echo ""

# Get OpenAI API Key
read -s -p "OpenAI API Key: " OPENAI_API_KEY
echo ""
if [ -z "$OPENAI_API_KEY" ]; then
    echo "ERROR: OpenAI API Key is required"
    exit 1
fi

echo ""
echo "Configuration summary:"
echo "API Key: ${OPENAI_API_KEY:0:7}***"
echo ""

# Create or update .env file
echo "Creating/updating .env file..."

# Remove existing OpenAI variables from .env if they exist
if [ -f ".env" ]; then
    grep -v -E "OPENAI_" .env > .env.tmp
    mv .env.tmp .env
fi

# Add OpenAI variables to .env
echo "" >> .env
echo "# OpenAI API Configuration" >> .env
echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env

echo ""
echo "✅ OpenAI environment variables configured successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure you have sufficient credits in your OpenAI account"
echo "2. Restart your API server: go run main.go"
echo "3. Test the AI service: curl http://localhost:8081/api/v1/ai/status"
echo ""
echo "Troubleshooting:"
echo "- If you get 'OpenAI client not initialized' error, make sure OPENAI_API_KEY is set correctly"
echo "- Check your OpenAI account for API usage and billing"
echo "- The AI service uses GPT-4 model for best results"
echo "- API calls may take a few seconds to complete" 