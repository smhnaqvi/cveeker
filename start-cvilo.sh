#!/bin/bash

echo "🚀 Starting Cvilo Application Stack..."

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

# Use REPO_NAME from environment variable (passed from GitHub Actions)
# Fallback to git config if not set (for local development)
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="ghcr.io/$(git config --get remote.origin.url | sed 's/.*github\.com[:/]\([^/]*\/[^/]*\).*/\1/')"
fi

echo "📦 Pulling latest images from GitHub Container Registry..."
echo "   Repository: $REPO_NAME"
echo "   Commit: latest"

# Pull the latest images
docker pull $REPO_NAME/cvilo-api:latest
docker pull $REPO_NAME/cvilo-clientarea:latest
docker pull $REPO_NAME/cvilo-landing-nextjs:latest

echo "🚀 Starting services with pulled images..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🔍 Checking if services are running..."
docker-compose ps

echo "✅ Cvilo stack is starting up!"
echo ""
echo "🌐 Services:"
echo "  - API: http://api.cvilo.com"
echo "  - Client Dashboard: http://app.cvilo.com"
echo "  - Landing Page: http://cvilo.com"
echo "  - PostgreSQL: localhost:5432"
echo "  - pgAdmin: http://localhost:5050 (admin@cvilo.com / admin123)"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose down" 

echo "✅ Cvilo stack is starting up!"