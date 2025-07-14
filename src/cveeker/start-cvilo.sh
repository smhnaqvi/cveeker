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

echo "📦 Building and starting all services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "✅ Cvilo stack is starting up!"
echo ""
echo "🌐 Services:"
echo "  - API: http://localhost:8081"
echo "  - Client Dashboard: http://localhost:3009"
echo "  - Landing Page: http://localhost:3001"
echo "  - Main Site: http://localhost (via nginx)"
echo "  - PostgreSQL: localhost:5432"
echo "  - pgAdmin: http://localhost:5050 (admin@cvilo.com / admin123)"
echo ""
echo "📊 Check service status:"
echo "  docker-compose ps"
echo ""
echo "📋 View logs:"
echo "  docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose down" 