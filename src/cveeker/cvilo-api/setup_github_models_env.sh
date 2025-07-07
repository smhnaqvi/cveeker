#!/bin/bash

# GitHub Models Environment Setup Script
# This script sets up environment variables for GitHub Models integration
# Used for prototype testing with GPT-4o model

echo "🚀 Setting up GitHub Models environment for prototype testing..."

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# GitHub Models Configuration
echo "📝 Configuring GitHub Models environment variables..."

# GitHub Models API Key (GITHUB_TOKEN as used in the JavaScript example)
echo "Enter your GitHub Token (get it from https://docs.github.com/en/github-models):"
read -s GITHUB_TOKEN

if [ -n "$GITHUB_TOKEN" ]; then
    # Remove existing GITHUB_TOKEN if present
    sed -i '/^GITHUB_TOKEN=/d' .env
    # Add new GITHUB_TOKEN
    echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env
    echo "✅ GitHub Token configured"
else
    echo "⚠️  No GitHub Token provided. You'll need to set it manually."
fi

# GitHub Models Base URL (optional, uses default if not set)
echo "Enter GitHub Models Base URL (press Enter to use default):"
read GITHUB_MODELS_BASE_URL

if [ -n "$GITHUB_MODELS_BASE_URL" ]; then
    # Remove existing GITHUB_MODELS_BASE_URL if present
    sed -i '/^GITHUB_MODELS_BASE_URL=/d' .env
    # Add new GITHUB_MODELS_BASE_URL
    echo "GITHUB_MODELS_BASE_URL=$GITHUB_MODELS_BASE_URL" >> .env
    echo "✅ GitHub Models Base URL configured: $GITHUB_MODELS_BASE_URL"
else
    # Set default GitHub Models Base URL
    sed -i '/^GITHUB_MODELS_BASE_URL=/d' .env
    echo "GITHUB_MODELS_BASE_URL=https://models.github.ai/inference" >> .env
    echo "✅ Using default GitHub Models Base URL: https://models.github.ai/inference"
fi

# Enable GitHub Models for prototype testing
echo "USE_GITHUB_MODELS=true" >> .env
echo "✅ GitHub Models enabled for prototype testing"

# Keep OpenAI configuration as fallback
if ! grep -q "OPENAI_API_KEY" .env; then
    echo "Enter your OpenAI API Key (optional, for fallback):"
    read -s OPENAI_API_KEY
    if [ -n "$OPENAI_API_KEY" ]; then
        echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env
        echo "✅ OpenAI API Key configured (fallback)"
    else
        echo "ℹ️  No OpenAI API Key provided (GitHub Models will be primary)"
    fi
fi

echo ""
echo "🎉 GitHub Models environment setup complete!"
echo ""
echo "📋 Configuration Summary:"
echo "   • GitHub Models: ENABLED (primary)"
echo "   • OpenAI: Configured as fallback"
echo "   • Model: GPT-4o (via GitHub Models)"
echo ""
echo "🔧 To switch back to OpenAI:"
echo "   • Set USE_GITHUB_MODELS=false in .env"
echo "   • Or run: echo 'USE_GITHUB_MODELS=false' >> .env"
echo ""
echo "🚀 Start your server with:"
echo "   • go run main.go"
echo ""
echo "📖 Documentation:"
echo "   • GitHub Models: https://docs.github.com/en/github-models"
echo "   • API Status: GET /api/ai/status"
echo "" 