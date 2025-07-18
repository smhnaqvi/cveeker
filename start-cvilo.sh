#!/bin/bash

# Cvilo Application Stack Starter
# ===============================
#
# Environment Variables:
# - MODE=dev|prod          : Set mode explicitly (dev or prod)
# - NON_INTERACTIVE=true   : Run in non-interactive mode (no user prompts)
# - PULL_IMAGES=true       : Pull latest images in production mode (default: true)
# - PULL_IMAGES=false      : Skip pulling images in production mode
#
# Usage:
#   Local: ./start-cvilo.sh
#   Dev mode: MODE=dev ./start-cvilo.sh
#   Prod mode: MODE=prod ./start-cvilo.sh
#   CI/CD: NON_INTERACTIVE=true MODE=prod ./start-cvilo.sh

echo "🚀 Cvilo Application Stack Starter"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Function to start development mode
start_dev_mode() {
    echo "🔧 Starting in DEVELOPMENT mode..."
    
    # Check if .env.dev exists
    if [ ! -f ".env.dev" ]; then
        echo "❌ .env.dev file not found!"
        echo "   Please create .env.dev file with your development environment variables."
        echo "   You can use env.dev.example as a template."
        exit 1
    fi
    
    echo "📋 Using .env.dev for environment variables..."
    echo "🔨 Building and starting development services..."
    
    # Build and start development services
    docker-compose -f docker-compose.dev.yml up -d --build
    
    echo "⏳ Waiting for services to be ready..."
    echo "   Waiting for PostgreSQL to be healthy..."
    sleep 15
    
    echo "🔍 Checking service status..."
    docker-compose -f docker-compose.dev.yml ps
    
    echo "✅ Development stack is starting up!"
    echo ""
    echo "🌐 Development Services:"
    echo "  - API: http://localhost:8081"
    echo "  - Client Dashboard: http://localhost:3009"
    echo "  - Landing Page: http://localhost:3001"
    echo "  - PostgreSQL: localhost:5432"
    echo ""
    echo "🛑 Stop development services:"
    echo "  docker-compose -f docker-compose.dev.yml down"
    echo ""
    echo "📝 View logs:"
    echo "  docker-compose -f docker-compose.dev.yml logs -f"
}

# Function to start production mode
start_prod_mode() {
    echo "🚀 Starting in PRODUCTION mode..."
    
    # Use REPO_NAME from environment variable (passed from GitHub Actions)
    # Fallback to git config if not set (for local development)
    if [ -z "$REPO_NAME" ]; then
        REPO_NAME="ghcr.io/$(git config --get remote.origin.url | sed 's/.*github\.com[:/]\([^/]*\/[^/]*\).*/\1/')"
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo "❌ .env.production file not found!"
        echo "   Please create .env.production file with your production environment variables."
        echo "   You can use env.example as a template."
        exit 1
    fi
    
    # Pull images if enabled (default: true)
    if [ "$PULL_IMAGES" != "false" ]; then
        echo "📦 Pulling latest images from GitHub Container Registry..."
        echo "   Repository: $REPO_NAME"
        echo "   Commit: latest"
        
        # Pull the latest images
        docker pull $REPO_NAME/cvilo-api:latest
        docker pull $REPO_NAME/cvilo-clientarea:latest
        docker pull $REPO_NAME/cvilo-landing-nextjs:latest
    else
        echo "⏭️  Skipping image pull (PULL_IMAGES=false)"
    fi
    
    echo "📋 Using .env.production for environment variables..."
    echo "🚀 Starting production services..."
    
    # Start production services
    docker-compose --env-file .env.production up -d
    
    echo "⏳ Waiting for services to be ready..."
    echo "   Waiting for PostgreSQL to be healthy..."
    sleep 15
    
    echo "🔍 Checking service status..."
    docker-compose ps
    
    echo "✅ Production stack is starting up!"
    echo ""
    echo "🌐 Production Services:"
    echo "  - API: http://api.cvilo.com"
    echo "  - Client Dashboard: http://app.cvilo.com"
    echo "  - Landing Page: http://cvilo.com"
    echo "  - PostgreSQL: localhost:5432"
    echo ""
    echo "🛑 Stop production services:"
    echo "  docker-compose down"
    echo ""
    echo "📝 View logs:"
    echo "  docker-compose logs -f"
}

# Determine mode
if [ "$NON_INTERACTIVE" != "true" ]; then
    echo "💻 Interactive mode"
    
    # If mode is not set, ask user
    if [ -z "$MODE" ]; then
        echo ""
        echo "🎯 Select mode:"
        echo "   1) Development (local build, hot reload, debug mode)"
        echo "   2) Production (pulled images, optimized, production config)"
        echo ""
        read -p "Choose mode (1/2): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[1]$ ]]; then
            MODE="dev"
        elif [[ $REPLY =~ ^[2]$ ]]; then
            MODE="prod"
        else
            echo "❌ Invalid selection. Exiting."
            exit 1
        fi
    fi
else
    echo "🤖 Non-interactive mode"
    # Set default mode for non-interactive if not provided
    if [ -z "$MODE" ]; then
        MODE="prod"
    fi
    echo "✅ Mode: $MODE"
fi

# Validate mode
if [ "$MODE" != "dev" ] && [ "$MODE" != "prod" ]; then
    echo "❌ Invalid mode: $MODE. Must be 'dev' or 'prod'."
    exit 1
fi

echo ""
echo "📊 Current Docker status:"
docker system df
echo ""

# Start based on mode
if [ "$MODE" = "dev" ]; then
    start_dev_mode
else
    start_prod_mode
fi