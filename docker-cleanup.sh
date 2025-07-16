#!/bin/bash

# Docker Cleanup Script
# ====================
#
# Environment Variables:
# - NON_INTERACTIVE=true       : Run in non-interactive mode (no user prompts)
# - PRESERVE_DB_VOLUMES=true   : Preserve database volumes (default)
# - PRESERVE_DB_VOLUMES=false  : Remove all volumes (dangerous!)
#
# Usage:
#   Local: ./docker-cleanup.sh
#   CI/CD: NON_INTERACTIVE=true PRESERVE_DB_VOLUMES=true ./docker-cleanup.sh

echo "🧹 Docker Cleanup Script"
echo "========================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Set defaults
if [ "$NON_INTERACTIVE" != "true" ]; then
    echo "💻 Interactive mode"
    
    # Ask about database volumes
    echo ""
    echo "🗄️  DATABASE VOLUMES:"
    echo "   - This will remove ALL Docker volumes including database data"
    echo "   - Your user data, resumes, chat history, etc. will be LOST"
    echo ""
    read -p "Do you want to preserve database volumes? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        PRESERVE_DB_VOLUMES=true
        echo "✅ Database volumes will be preserved."
    else
        PRESERVE_DB_VOLUMES=false
        echo "⚠️  Database volumes will be removed (ALL DATA WILL BE LOST)."
    fi
    
    # Confirm cleanup
    echo ""
    echo "⚠️  WARNING: This will remove ALL Docker containers, images, networks, and build cache!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cleanup cancelled."
        exit 1
    fi
else
    echo "🤖 Non-interactive mode"
    # Set default for non-interactive mode
    if [ -z "$PRESERVE_DB_VOLUMES" ]; then
        PRESERVE_DB_VOLUMES=true
    fi
    echo "✅ Database volumes setting: $PRESERVE_DB_VOLUMES"
fi

echo ""
echo "📊 Disk usage before cleanup:"
docker system df
echo ""

# Start cleanup
echo "🛑 Starting Docker cleanup..."

# Stop and remove project containers
echo "🗑️  Stopping project containers..."
if [ "$PRESERVE_DB_VOLUMES" = true ]; then
    docker-compose down --remove-orphans
else
    docker-compose down --volumes --remove-orphans
fi

# Remove all containers
echo "🗑️  Removing all containers..."
docker container stop $(docker container ls -aq) 2>/dev/null || true
docker container rm $(docker container ls -aq) 2>/dev/null || true

# Remove all images
echo "🗑️  Removing all images..."
docker image rm $(docker image ls -aq) 2>/dev/null || true

# Remove networks
echo "🗑️  Removing unused networks..."
docker network prune -f

# Handle volumes based on setting
if [ "$PRESERVE_DB_VOLUMES" = true ]; then
    echo "🗄️  Preserving database volumes (skipping volume cleanup)"
else
    echo "🗑️  Removing all volumes (database data will be lost!)"
    docker volume prune -f
fi

# Clear build cache
echo "🗑️  Clearing build cache..."
docker builder prune -af

# Final system prune
echo "🗑️  Final system cleanup..."
if [ "$PRESERVE_DB_VOLUMES" = true ]; then
    docker system prune -af
else
    docker system prune -af --volumes
fi

echo ""
echo "📊 Disk usage after cleanup:"
docker system df

echo ""
echo "🎉 Cleanup completed!"
if [ "$PRESERVE_DB_VOLUMES" = true ]; then
    echo "✅ Database data preserved"
else
    echo "⚠️  All data removed"
fi 