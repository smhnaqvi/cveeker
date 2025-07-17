#!/bin/bash

# CVilo API Complete Environment Setup Script
# This script sets up all required environment variables for the CVilo API
# Supports both development (.env) and production (.env.production) setup

echo "🚀 CVilo API Complete Environment Setup"
echo "========================================"
echo ""

# Ask user for environment type
echo "Choose environment type:"
echo "1. Development (.env)"
echo "2. Production (.env.production)"
read -p "Enter choice (1-2): " env_choice

if [ "$env_choice" = "2" ]; then
    ENV_FILE=".env.production"
    echo ""
    echo "🏭 Setting up PRODUCTION environment (.env.production)"
    echo "======================================================"
else
    ENV_FILE=".env"
    echo ""
    echo "🛠️  Setting up DEVELOPMENT environment (.env)"
    echo "============================================="
fi

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

# Create environment file if it doesn't exist
if [ ! -f $ENV_FILE ]; then
    echo "Creating $ENV_FILE file..."
    touch $ENV_FILE
    print_status "Created new $ENV_FILE file"
else
    echo "Found existing $ENV_FILE file"
    print_info "Backing up existing $ENV_FILE to ${ENV_FILE}.backup"
    cp $ENV_FILE ${ENV_FILE}.backup
fi

echo ""
echo "📋 Setting up basic configuration..."
echo ""

# Database Configuration
echo "Database Configuration:"
if [ "$env_choice" = "2" ]; then
    # Production database settings
    echo "Using PostgreSQL for production..."
    read -p "PostgreSQL Database Name (default: cvilo_db): " POSTGRES_DB
    POSTGRES_DB=${POSTGRES_DB:-cvilo_db}
    
    read -p "PostgreSQL Host (default: postgres): " POSTGRES_HOST
    POSTGRES_HOST=${POSTGRES_HOST:-postgres}
    
    read -p "PostgreSQL User (default: postgres): " POSTGRES_USER
    POSTGRES_USER=${POSTGRES_USER:-postgres}
    
    read -s -p "PostgreSQL Password: " POSTGRES_PASSWORD
    echo ""
    if [ -z "$POSTGRES_PASSWORD" ]; then
        print_error "PostgreSQL Password is required for production"
        exit 1
    fi
    
    read -p "PostgreSQL Port (default: 5432): " POSTGRES_PORT
    POSTGRES_PORT=${POSTGRES_PORT:-5432}
    
    read -p "PostgreSQL SSL Mode (default: disable): " POSTGRES_SSLMODE
    POSTGRES_SSLMODE=${POSTGRES_SSLMODE:-disable}
else
    # Development database settings
    read -p "Database path (default: cvilo.db): " DB_PATH
    DB_PATH=${DB_PATH:-cvilo.db}
fi

# Server Configuration
echo ""
echo "Server Configuration:"
read -p "Port (default: 8081): " PORT
PORT=${PORT:-8081}

if [ "$env_choice" = "2" ]; then
    read -p "Host (default: 0.0.0.0): " HOST
    HOST=${HOST:-0.0.0.0}
else
    read -p "Host (default: localhost): " HOST
    HOST=${HOST:-localhost}
fi

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
if [ "$env_choice" = "2" ]; then
    read -p "CORS Origin (e.g., https://yourdomain.com): " CORS_ORIGIN
    if [ -z "$CORS_ORIGIN" ]; then
        print_error "CORS Origin is required for production"
        exit 1
    fi
    
    read -p "API Base URL (e.g., https://api.yourdomain.com): " API_BASE_URL
    if [ -z "$API_BASE_URL" ]; then
        print_error "API Base URL is required for production"
        exit 1
    fi
else
    read -p "CORS Origin (default: http://localhost:3000): " CORS_ORIGIN
    CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}
    
    read -p "API Base URL (default: http://localhost:8081): " API_BASE_URL
    API_BASE_URL=${API_BASE_URL:-http://localhost:8081}
fi

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
if [ "$env_choice" = "2" ]; then
    echo "Choose LinkedIn redirect URL for production:"
    echo "1. https://api.yourdomain.com/api/v1/linkedin/callback (API server)"
    echo "2. https://app.yourdomain.com/auth/linkedin/callback (Frontend)"
    echo "3. Custom URL"
    read -p "Enter choice (1-3): " choice

    case $choice in
        1)
            read -p "Enter your API domain (e.g., api.yourdomain.com): " API_DOMAIN
            LINKEDIN_REDIRECT_URL="https://$API_DOMAIN/api/v1/linkedin/callback"
            ;;
        2)
            read -p "Enter your frontend domain (e.g., app.yourdomain.com): " FRONTEND_DOMAIN
            LINKEDIN_REDIRECT_URL="https://$FRONTEND_DOMAIN/auth/linkedin/callback"
            ;;
        3)
            read -p "Enter custom redirect URL: " LINKEDIN_REDIRECT_URL
            ;;
        *)
            print_warning "Invalid choice, using default API server URL"
            read -p "Enter your API domain (e.g., api.yourdomain.com): " API_DOMAIN
            LINKEDIN_REDIRECT_URL="https://$API_DOMAIN/api/v1/linkedin/callback"
            ;;
    esac
else
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
fi

# AI Service Configuration
echo ""
echo "🤖 AI Service Configuration:"
echo "============================"

echo "Choose your AI service provider:"
echo "1. OpenAI (GPT-4)"
echo "2. GitHub Models (GPT-4o)"
echo "3. Both (GitHub Models primary, OpenAI fallback)"
read -p "Enter choice (1-3): " ai_choice

# Set AI model based on choice
case $ai_choice in
    1)
        AI_MODEL="gpt-4"
        ;;
    2)
        AI_MODEL="gpt-4o"
        ;;
    3)
        AI_MODEL="gpt-4o"
        ;;
    *)
        AI_MODEL="gpt-4"
        ;;
esac

case $ai_choice in
    1)
        USE_GITHUB_MODELS=false
        print_info "Setting up OpenAI configuration..."
        read -s -p "OpenAI API Key: " AI_TOKEN
        echo ""
        if [ -z "$AI_TOKEN" ]; then
            print_error "OpenAI API Key is required"
            exit 1
        fi
        AI_URL="https://api.openai.com/v1"
        ;;
    2)
        USE_GITHUB_MODELS=true
        print_info "Setting up GitHub Models configuration..."
        read -s -p "GitHub Token: " AI_TOKEN
        echo ""
        if [ -z "$AI_TOKEN" ]; then
            print_error "GitHub Token is required"
            exit 1
        fi
        
        read -p "GitHub Models Base URL (press Enter for default): " MODELS_BASE_URL
        MODELS_BASE_URL=${MODELS_BASE_URL:-https://models.github.ai/inference}
        AI_URL="https://api.openai.com/v1"
        ;;
    3)
        USE_GITHUB_MODELS=true
        print_info "Setting up both GitHub Models and OpenAI..."
        
        read -s -p "GitHub Token: " AI_TOKEN
        echo ""
        if [ -z "$AI_TOKEN" ]; then
            print_error "GitHub Token is required"
            exit 1
        fi
        
        read -p "GitHub Models Base URL (press Enter for default): " MODELS_BASE_URL
        MODELS_BASE_URL=${MODELS_BASE_URL:-https://models.github.ai/inference}
        AI_URL="https://api.openai.com/v1"
        
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

echo ""
echo "📝 Writing configuration to $ENV_FILE file..."
echo ""

# Clear existing environment file and write new configuration
if [ "$env_choice" = "2" ]; then
    # Production configuration
    cat > $ENV_FILE << EOF
# ===== PRODUCTION ENVIRONMENT VARIABLES =====
# Generated by setup.sh - $(date)

# ===== REQUIRED FOR BASIC FUNCTIONALITY =====
# Database Configuration (PostgreSQL)
POSTGRES_DB=$POSTGRES_DB
POSTGRES_HOST=$POSTGRES_HOST
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_PORT=$POSTGRES_PORT
POSTGRES_SSLMODE=$POSTGRES_SSLMODE

# Security
JWT_SECRET=$JWT_SECRET

# Application Configuration
HOST=$HOST
PORT=$PORT
GIN_MODE=release

# ===== REQUIRED FOR FRONTEND =====
CORS_ORIGIN=$CORS_ORIGIN
API_BASE_URL=$API_BASE_URL

# ===== REQUIRED FOR LINKEDIN LOGIN =====
LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URL=$LINKEDIN_REDIRECT_URL

# ===== REQUIRED FOR AI FEATURES =====
AI_MODEL=$AI_MODEL
AI_TOKEN=$AI_TOKEN
AI_URL=$AI_URL
USE_GITHUB_MODELS=$USE_GITHUB_MODELS
EOF

    # Add GitHub Models configuration if enabled
    if [ "$USE_GITHUB_MODELS" = true ] && [ -n "$MODELS_BASE_URL" ]; then
        cat >> $ENV_FILE << EOF
MODELS_BASE_URL=$MODELS_BASE_URL
EOF
    fi

    # Add OpenAI fallback if provided
    if [ -n "$OPENAI_API_KEY" ]; then
        cat >> $ENV_FILE << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
    fi

    # Add optional metadata
    cat >> $ENV_FILE << EOF

# ===== OPTIONAL METADATA =====
BUILD_VERSION=
BUILD_DATE=
EOF

else
    # Development configuration
    cat > $ENV_FILE << EOF
# ===== DEVELOPMENT ENVIRONMENT VARIABLES =====
# Generated by setup.sh - $(date)

# Database Configuration (SQLite)
DB_PATH=$DB_PATH
SQL_CONNECTION=$DB_PATH

# Server Configuration
PORT=$PORT
HOST=$HOST

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# CORS Configuration
CORS_ORIGIN=$CORS_ORIGIN
API_BASE_URL=$API_BASE_URL

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URL=$LINKEDIN_REDIRECT_URL

# AI Service Configuration
USE_GITHUB_MODELS=$USE_GITHUB_MODELS
EOF

    # Add GitHub Models configuration if enabled
    if [ "$USE_GITHUB_MODELS" = true ]; then
        cat >> $ENV_FILE << EOF
GITHUB_TOKEN=$AI_TOKEN
GITHUB_MODELS_BASE_URL=$MODELS_BASE_URL
EOF
    fi

    # Add OpenAI configuration if provided
    if [ -n "$OPENAI_API_KEY" ]; then
        cat >> $ENV_FILE << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
    fi
fi

print_status "Configuration written to $ENV_FILE file"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Configuration Summary:"
if [ "$env_choice" = "2" ]; then
    echo "   • Environment: PRODUCTION (.env.production)"
    echo "   • Database: PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB)"
    echo "   • Server: $HOST:$PORT"
    echo "   • API Base URL: $API_BASE_URL"
    echo "   • CORS Origin: $CORS_ORIGIN"
    echo "   • LinkedIn OAuth: $([ -n "$LINKEDIN_CLIENT_ID" ] && echo "Configured" || echo "Disabled")"
    echo "   • AI Service: $([ "$USE_GITHUB_MODELS" = true ] && echo "GitHub Models" || echo "OpenAI")"
    echo ""
    echo "🚀 Production Deployment Steps:"
    echo "1. Copy .env.production to your server at /opt/cveeker/.env.production"
    echo "2. Set proper permissions: chmod 600 .env.production"
    echo "3. Deploy using: ./start-cvilo.sh"
    echo "4. Test the API: curl https://api.yourdomain.com/ping"
    echo ""
    echo "🔒 Security Notes:"
    echo "• Keep .env.production secure and never commit to Git"
    echo "• Use strong passwords for PostgreSQL and JWT_SECRET"
    echo "• Enable HTTPS in production"
    echo "• Regularly update dependencies"
    echo ""
else
    echo "   • Environment: DEVELOPMENT (.env)"
    echo "   • Database: SQLite ($DB_PATH)"
    echo "   • Server: $HOST:$PORT"
    echo "   • API Base URL: $API_BASE_URL"
    echo "   • CORS Origin: $CORS_ORIGIN"
    echo "   • LinkedIn OAuth: $([ -n "$LINKEDIN_CLIENT_ID" ] && echo "Configured" || echo "Disabled")"
    echo "   • AI Service: $([ "$USE_GITHUB_MODELS" = true ] && echo "GitHub Models" || echo "OpenAI")"
    echo ""
    echo "🚀 Development Next Steps:"
    echo "1. Start the API server: go run main.go"
    echo "2. Test the server: curl http://localhost:$PORT/ping"
    echo "3. Test AI service: curl http://localhost:$PORT/api/v1/ai/status"
    echo ""
fi

if [ -n "$LINKEDIN_CLIENT_ID" ]; then
    echo "🔗 LinkedIn Setup:"
    echo "1. Configure your LinkedIn app with redirect URL: $LINKEDIN_REDIRECT_URL"
    if [ "$env_choice" = "2" ]; then
        echo "2. Test OAuth flow: https://api.yourdomain.com/api/v1/linkedin/auth"
    else
        echo "2. Test OAuth flow: http://localhost:$PORT/api/v1/linkedin/auth"
    fi
    echo ""
fi

echo "📖 Troubleshooting:"
echo "• Check logs for detailed error messages"
echo "• Verify all environment variables are set correctly"
echo "• Make sure ports are not in use by other services"
echo "• For production, ensure all secrets are properly configured"
echo ""

print_status "Environment setup completed successfully!" 