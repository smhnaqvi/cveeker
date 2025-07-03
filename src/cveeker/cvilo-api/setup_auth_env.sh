#!/bin/bash

# Setup environment variables for authentication
echo "Setting up authentication environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_PATH=cvilo.db

# Server Configuration
PORT=8081
HOST=localhost

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF
    echo ".env file created successfully!"
else
    echo ".env file already exists. Please check if JWT_SECRET is set."
fi

echo ""
echo "Environment setup completed!"
echo "Make sure to:"
echo "1. Set a strong JWT_SECRET in production"
echo "2. Configure your LinkedIn OAuth credentials"
echo "3. Update CORS_ORIGIN if needed" 