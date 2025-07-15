#!/bin/bash

# CVilo API Complete Environment Setup Script
# This script sets up all required environment variables for the CVilo API

echo "🚀 CVilo API Complete Environment Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
    print_status "Created new .env file"
else
    echo "Found existing .env file"
    print_info "Backing up existing .env to .env.backup"
    cp .env .env.backup
fi

echo ""
echo "📋 Setting up basic configuration..."
echo ""

# Database Configuration
echo "Database Configuration:"
read -p "Database path (default: cvilo.db): " DB_PATH
DB_PATH=${DB_PATH:-cvilo.db}

# Server Configuration
echo ""
echo "Server Configuration:"
read -p "Port (default: 8081): " PORT
PORT=${PORT:-8081}

read -p "Host (default: localhost): " HOST
HOST=${HOST:-localhost}

# JWT Configuration
echo ""
echo "JWT Configuration:"
read -s -p "JWT Secret (press Enter for auto-generation): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    print_info "Auto-generated JWT secret"
fi

# CORS Configuration
echo ""
echo "CORS Configuration:"
read -p "CORS Origin (default: http://localhost:3000): " CORS_ORIGIN
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}

# LinkedIn OAuth Configuration
echo ""
echo "🔗 LinkedIn OAuth Configuration:"
echo "================================"

read -p "LinkedIn Client ID: " LINKEDIN_CLIENT_ID
if [ -z "$LINKEDIN_CLIENT_ID" ]; then
    print_warning "LinkedIn Client ID not provided - LinkedIn features will be disabled"
fi

read -s -p "LinkedIn Client Secret: " LINKEDIN_CLIENT_SECRET
echo ""
if [ -z "$LINKEDIN_CLIENT_SECRET" ]; then
    print_warning "LinkedIn Client Secret not provided - LinkedIn features will be disabled"
fi

echo ""
echo "Choose LinkedIn redirect URL:"
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
        print_warning "Invalid choice, using default API server URL"
        LINKEDIN_REDIRECT_URL="http://localhost:8081/api/v1/linkedin/callback"
        ;;
esac

# AI Service Configuration
echo ""
echo "🤖 AI Service Configuration:"
echo "============================"

echo "Choose your AI service provider:"
echo "1. OpenAI (GPT-4)"
echo "2. GitHub Models (GPT-4o)"
echo "3. Both (GitHub Models primary, OpenAI fallback)"
read -p "Enter choice (1-3): " ai_choice

case $ai_choice in
    1)
        USE_GITHUB_MODELS=false
        print_info "Setting up OpenAI configuration..."
        read -s -p "OpenAI API Key: " OPENAI_API_KEY
        echo ""
        if [ -z "$OPENAI_API_KEY" ]; then
            print_error "OpenAI API Key is required"
            exit 1
        fi
        ;;
    2)
        USE_GITHUB_MODELS=true
        print_info "Setting up GitHub Models configuration..."
        read -s -p "GitHub Token: " GITHUB_TOKEN
        echo ""
        if [ -z "$GITHUB_TOKEN" ]; then
            print_error "GitHub Token is required"
            exit 1
        fi
        
        read -p "GitHub Models Base URL (press Enter for default): " GITHUB_MODELS_BASE_URL
        GITHUB_MODELS_BASE_URL=${GITHUB_MODELS_BASE_URL:-https://models.github.ai/inference}
        ;;
    3)
        USE_GITHUB_MODELS=true
        print_info "Setting up both GitHub Models and OpenAI..."
        
        read -s -p "GitHub Token: " GITHUB_TOKEN
        echo ""
        if [ -z "$GITHUB_TOKEN" ]; then
            print_error "GitHub Token is required"
            exit 1
        fi
        
        read -p "GitHub Models Base URL (press Enter for default): " GITHUB_MODELS_BASE_URL
        GITHUB_MODELS_BASE_URL=${GITHUB_MODELS_BASE_URL:-https://models.github.ai/inference}
        
        read -s -p "OpenAI API Key (for fallback): " OPENAI_API_KEY
        echo ""
        if [ -z "$OPENAI_API_KEY" ]; then
            print_warning "OpenAI API Key not provided - no fallback available"
        fi
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# SQL Connection
SQL_CONNECTION=$DB_PATH

echo ""
echo "📝 Writing configuration to .env file..."
echo ""

# Clear existing .env file and write new configuration
cat > .env << EOF
# Database Configuration
DB_PATH=$DB_PATH
SQL_CONNECTION=$SQL_CONNECTION

# Server Configuration
PORT=$PORT
HOST=$HOST

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# CORS Configuration
CORS_ORIGIN=$CORS_ORIGIN

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URL=$LINKEDIN_REDIRECT_URL

# AI Service Configuration
USE_GITHUB_MODELS=$USE_GITHUB_MODELS
EOF

# Add GitHub Models configuration if enabled
if [ "$USE_GITHUB_MODELS" = true ]; then
    cat >> .env << EOF
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_MODELS_BASE_URL=$GITHUB_MODELS_BASE_URL
EOF
fi

# Add OpenAI configuration if provided
if [ -n "$OPENAI_API_KEY" ]; then
    cat >> .env << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
fi

print_status "Configuration written to .env file"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Configuration Summary:"
echo "   • Database: $DB_PATH"
echo "   • Server: $HOST:$PORT"
echo "   • CORS Origin: $CORS_ORIGIN"
echo "   • LinkedIn OAuth: $([ -n "$LINKEDIN_CLIENT_ID" ] && echo "Configured" || echo "Disabled")"
echo "   • AI Service: $([ "$USE_GITHUB_MODELS" = true ] && echo "GitHub Models" || echo "OpenAI")"
echo ""

echo "🚀 Next Steps:"
echo "1. Start the API server: go run main.go"
echo "2. Test the server: curl http://localhost:$PORT/ping"
echo "3. Test AI service: curl http://localhost:$PORT/api/v1/ai/status"
echo ""

if [ -n "$LINKEDIN_CLIENT_ID" ]; then
    echo "🔗 LinkedIn Setup:"
    echo "1. Configure your LinkedIn app with redirect URL: $LINKEDIN_REDIRECT_URL"
    echo "2. Test OAuth flow: http://localhost:$PORT/api/v1/linkedin/auth"
    echo ""
fi

echo "📖 Troubleshooting:"
echo "• Check logs for detailed error messages"
echo "• Verify all environment variables are set correctly"
echo "• Make sure ports are not in use by other services"
echo "• For production, change JWT_SECRET to a strong random string"
echo ""

print_status "Environment setup completed successfully!" 