#!/bin/bash

# Docker Cleanup Script
# ====================
#
# Environment Variables:
# - NON_INTERACTIVE=true       : Run in non-interactive mode (no user prompts)
# - PRESERVE_DB_VOLUMES=true   : Preserve database volumes (default)
# - PRESERVE_DB_VOLUMES=false  : Remove all volumes (dangerous!)
# - TARGET_IMAGES=image1,image2 : Comma-separated list of specific images to remove
# - TARGET_CONTAINERS=cont1,cont2 : Comma-separated list of specific containers to stop/remove
# - TARGETED_CLEANUP=true      : Only remove specified images/containers (skip full cleanup)
#
# Usage:
#   Local: ./docker-cleanup.sh
#   CI/CD: NON_INTERACTIVE=true PRESERVE_DB_VOLUMES=true ./docker-cleanup.sh
#   Targeted: TARGETED_CLEANUP=true TARGET_IMAGES=myapp:latest TARGET_CONTAINERS=myapp ./docker-cleanup.sh

echo "🧹 Docker Cleanup Script"
echo "========================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to remove specific images
remove_specific_images() {
    local images="$1"
    if [ -n "$images" ]; then
        echo "🎯 Removing specific images: $images"
        IFS=',' read -ra IMAGE_ARRAY <<< "$images"
        for image in "${IMAGE_ARRAY[@]}"; do
            image=$(echo "$image" | xargs) # trim whitespace
            if [ -n "$image" ]; then
                echo "   🗑️  Removing image: $image"
                docker image rm "$image" 2>/dev/null || echo "   ⚠️  Image $image not found or could not be removed"
            fi
        done
    fi
}

# Function to stop and remove specific containers
remove_specific_containers() {
    local containers="$1"
    if [ -n "$containers" ]; then
        echo "🎯 Stopping and removing specific containers: $containers"
        IFS=',' read -ra CONTAINER_ARRAY <<< "$containers"
        for container in "${CONTAINER_ARRAY[@]}"; do
            container=$(echo "$container" | xargs) # trim whitespace
            if [ -n "$container" ]; then
                echo "   🛑 Stopping container: $container"
                docker container stop "$container" 2>/dev/null || echo "   ⚠️  Container $container not found or already stopped"
                echo "   🗑️  Removing container: $container"
                docker container rm "$container" 2>/dev/null || echo "   ⚠️  Container $container not found or could not be removed"
            fi
        done
    fi
}

# Check if this is a targeted cleanup
if [ "$TARGETED_CLEANUP" = "true" ]; then
    echo "🎯 Targeted cleanup mode"
    
    if [ "$NON_INTERACTIVE" != "true" ]; then
        echo "💻 Interactive mode"
        
        # Ask for specific images if not provided
        if [ -z "$TARGET_IMAGES" ]; then
            echo ""
            read -p "Enter specific images to remove (comma-separated, or press Enter to skip): " TARGET_IMAGES
        fi
        
        # Ask for specific containers if not provided
        if [ -z "$TARGET_CONTAINERS" ]; then
            echo ""
            read -p "Enter specific containers to stop/remove (comma-separated, or press Enter to skip): " TARGET_CONTAINERS
        fi
        
        # Confirm targeted cleanup
        if [ -n "$TARGET_IMAGES" ] || [ -n "$TARGET_CONTAINERS" ]; then
            echo ""
            echo "🎯 You are about to remove:"
            [ -n "$TARGET_IMAGES" ] && echo "   Images: $TARGET_IMAGES"
            [ -n "$TARGET_CONTAINERS" ] && echo "   Containers: $TARGET_CONTAINERS"
            read -p "Continue? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "❌ Targeted cleanup cancelled."
                exit 1
            fi
        else
            echo "❌ No targets specified for cleanup."
            exit 1
        fi
    fi
    
    echo ""
    echo "📊 Disk usage before targeted cleanup:"
    docker system df
    echo ""
    
    # Perform targeted cleanup
    remove_specific_containers "$TARGET_CONTAINERS"
    remove_specific_images "$TARGET_IMAGES"
    
    echo ""
    echo "📊 Disk usage after targeted cleanup:"
    docker system df
    echo ""
    echo "🎉 Targeted cleanup completed!"
    exit 0
fi

# Set defaults for full cleanup
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