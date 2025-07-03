#!/bin/bash

# LinkedIn OAuth Environment Setup Script
# This script helps you set up the required environment variables for LinkedIn OAuth

echo "=== LinkedIn OAuth Environment Setup ==="
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "Found existing .env file"
    echo "Current LinkedIn configuration:"
    grep -E "LINKEDIN_" .env || echo "No LinkedIn variables found in .env"
    echo ""
fi

echo "Please provide the following LinkedIn OAuth credentials:"
echo ""

# Get LinkedIn Client ID
read -p "LinkedIn Client ID: " LINKEDIN_CLIENT_ID
if [ -z "$LINKEDIN_CLIENT_ID" ]; then
    echo "ERROR: LinkedIn Client ID is required"
    exit 1
fi

# Get LinkedIn Client Secret
read -s -p "LinkedIn Client Secret: " LINKEDIN_CLIENT_SECRET
echo ""
if [ -z "$LINKEDIN_CLIENT_SECRET" ]; then
    echo "ERROR: LinkedIn Client Secret is required"
    exit 1
fi

# Get LinkedIn Redirect URL
echo ""
echo "Choose redirect URL:"
echo "1. http://localhost:8081/api/v1/linkedin/callback (API server)"
echo "2. http://localhost:3000/auth/linkedin/callback (Frontend)"
echo "3. Custom URL"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        LINKEDIN_REDIRECT_URL="http://localhost:8081/api/v1/linkedin/callback"
        ;;
    2)
        LINKEDIN_REDIRECT_URL="http://localhost:3000/auth/linkedin/callback"
        ;;
    3)
        read -p "Enter custom redirect URL: " LINKEDIN_REDIRECT_URL
        ;;
    *)
        echo "Invalid choice, using default API server URL"
        LINKEDIN_REDIRECT_URL="http://localhost:8081/api/v1/linkedin/callback"
        ;;
esac

if [ -z "$LINKEDIN_REDIRECT_URL" ]; then
    echo "ERROR: LinkedIn Redirect URL is required"
    exit 1
fi

echo ""
echo "Configuration summary:"
echo "Client ID: ${LINKEDIN_CLIENT_ID:0:4}***"
echo "Client Secret: ***"
echo "Redirect URL: $LINKEDIN_REDIRECT_URL"
echo ""

# Create or update .env file
echo "Creating/updating .env file..."

# Remove existing LinkedIn variables from .env if they exist
if [ -f ".env" ]; then
    grep -v -E "LINKEDIN_" .env > .env.tmp
    mv .env.tmp .env
fi

# Add LinkedIn variables to .env
echo "" >> .env
echo "# LinkedIn OAuth Configuration" >> .env
echo "LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID" >> .env
echo "LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET" >> .env
echo "LINKEDIN_REDIRECT_URL=$LINKEDIN_REDIRECT_URL" >> .env

echo ""
echo "✅ Environment variables configured successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure your LinkedIn app is configured with the redirect URL: $LINKEDIN_REDIRECT_URL"
echo "2. Restart your API server: go run main.go"
echo "3. Test the OAuth flow"
echo ""
echo "Troubleshooting:"
echo "- If you get 'redirect uri does not match' error, make sure the redirect URL in your LinkedIn app matches exactly"
echo "- Authorization codes expire quickly (10 minutes), so complete the flow promptly"
echo "- Check the logs for detailed debugging information" 