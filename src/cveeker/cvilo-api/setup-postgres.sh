#!/bin/bash

echo "🚀 Setting up PostgreSQL for Cvilo API..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting PostgreSQL container..."
docker-compose -f docker-compose.postgres.yml up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🔧 Creating .env file for PostgreSQL..."
cat > .env << EOF
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=cvilo_password
POSTGRES_DB=cvilo_db
POSTGRES_SSLMODE=disable
EOF

echo "📥 Installing Go dependencies..."
go mod tidy

echo "🔄 Running database migrations..."
go run main.go

echo "✅ PostgreSQL setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start your API: go run main.go"
echo ""
echo "🌐 Optional: Access pgAdmin at http://localhost:5050"
echo "   Email: admin@cvilo.com"
echo "   Password: admin123"
echo ""
echo "🗄️  PostgreSQL is running on localhost:5432" 