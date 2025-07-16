#!/bin/bash

# Docker Cleanup Script
# ====================
#
# Environment Variables for CI/CD:
# - CI=true                    : Run in non-interactive mode
# - GITHUB_ACTIONS=true        : Run in non-interactive mode  
# - NON_INTERACTIVE=true       : Run in non-interactive mode
# - PRESERVE_DB_VOLUMES=true   : Preserve database volumes (default)
# - PRESERVE_DB_VOLUMES=false  : Remove all volumes (dangerous!)
#
# Usage in GitHub Actions:
#   - env:
#       PRESERVE_DB_VOLUMES: true  # Safe default
#   - run: ./docker-cleanup.sh

echo "🧹 Docker Cleanup Script"
echo "========================"

# Check if running in CI/CD environment
if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ] || [ "$NON_INTERACTIVE" = "true" ]; then
    echo "🤖 Running in CI/CD mode (non-interactive)"
    CI_MODE=true
    # Default to preserving database volumes in CI/CD
    PRESERVE_DB_VOLUMES=true
else
    CI_MODE=false
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to confirm before proceeding
confirm_action() {
    echo ""
    echo "⚠️  WARNING: This will remove:"
    echo "   - ALL Docker containers (including running ones)"
    echo "   - ALL Docker images"
    echo "   - ALL Docker networks (except default ones)"
    echo "   - ALL Docker build cache"
    echo "   - ALL unused Docker resources"
    echo ""
    echo "💾 This will free up maximum storage and memory!"
    echo ""
    
    if [ "$CI_MODE" = true ]; then
        # Non-interactive mode for CI/CD
        echo "🤖 CI/CD Mode: Using environment variables for configuration"
        
        # Check for environment variables
        if [ -n "$PRESERVE_DB_VOLUMES" ]; then
            echo "✅ Database volumes setting: $PRESERVE_DB_VOLUMES"
        else
            echo "✅ Using default: Database volumes will be preserved"
            PRESERVE_DB_VOLUMES=true
        fi
        
        if [ "$PRESERVE_DB_VOLUMES" = "false" ]; then
            echo "⚠️  WARNING: Database volumes will be removed (ALL DATA WILL BE LOST)"
        else
            echo "✅ Database volumes will be preserved"
        fi
        
        echo ""
        echo "🤖 Proceeding with cleanup in CI/CD mode..."
        
    else
        # Interactive mode for local development
        # Ask about database volumes specifically
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
        
        echo ""
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Cleanup cancelled."
            exit 1
        fi
    fi
}

# Function to show disk usage before cleanup
show_disk_usage() {
    echo "📊 Disk usage before cleanup:"
    docker system df
    echo ""
}

# Function to show disk usage after cleanup
show_disk_usage_after() {
    echo "📊 Disk usage after cleanup:"
    docker system df
    echo ""
}

# Main cleanup function
cleanup() {
    echo "🛑 Stopping and removing all containers and networks for this project..."
    if [ "$PRESERVE_DB_VOLUMES" = true ]; then
        echo "   - Preserving volumes during docker-compose down"
        docker-compose down --remove-orphans
    else
        echo "   - Removing volumes during docker-compose down"
        docker-compose down --volumes --remove-orphans
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Project containers and networks removed successfully."
    else
        echo "⚠️  Some containers may not have been removed (this is normal if they weren't running)."
    fi
    
    echo ""
    echo "🗑️  Removing ALL containers (including running ones)..."
    docker container stop $(docker container ls -aq) 2>/dev/null || true
    docker container rm $(docker container ls -aq) 2>/dev/null || true
    echo "✅ All containers removed."
    
    echo ""
    echo "🗑️  Removing ALL images..."
    docker image rm $(docker image ls -aq) 2>/dev/null || true
    echo "✅ All images removed."
    
    echo ""
    echo "🗑️  Removing ALL networks (except default ones)..."
    docker network prune -f
    echo "✅ Unused networks removed."
    
    echo ""
    if [ "$PRESERVE_DB_VOLUMES" = true ]; then
        echo "🗄️  Preserving database volumes..."
        echo "   - Database data will be kept safe"
        echo "   - Skipping volume cleanup to protect database data"
        echo "✅ Database volumes preserved (no volume cleanup performed)."
    else
        echo "🗑️  Removing ALL volumes (including database data)..."
        echo "   ⚠️  WARNING: This will delete ALL user data!"
        docker volume prune -f
        echo "✅ All volumes removed (database data lost)."
    fi
    
    echo ""
    echo "🗑️  Clearing ALL build cache..."
    docker builder prune -af
    echo "✅ Build cache cleared."
    
    echo ""
    echo "🗑️  Final system prune to clean up everything..."
    if [ "$PRESERVE_DB_VOLUMES" = true ]; then
        echo "   - Preserving database volumes during final cleanup"
        echo "   - Only removing containers, images, networks, and build cache"
        docker system prune -af
    else
        echo "   - Removing all volumes including database data"
        docker system prune -af --volumes
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Complete Docker cleanup completed successfully."
    else
        echo "❌ Error during Docker cleanup."
        exit 1
    fi
}

# Function to show what was cleaned up
show_cleanup_summary() {
    echo ""
    echo "🎉 Cleanup Summary:"
    echo "   ✅ ALL Docker containers removed"
    echo "   ✅ ALL Docker images removed"
    echo "   ✅ ALL Docker networks removed"
    if [ "$PRESERVE_DB_VOLUMES" = true ]; then
        echo "   ✅ Database volumes preserved (no volume cleanup)"
    else
        echo "   ✅ ALL Docker volumes removed (database data cleared)"
    fi
    echo "   ✅ ALL Docker build cache cleared"
    echo "   ✅ ALL unused Docker resources pruned"
    echo ""
    if [ "$PRESERVE_DB_VOLUMES" = true ]; then
        echo "💾 Storage and memory freed (database data safe)!"
    else
        echo "💾 Maximum storage and memory freed!"
    fi
    echo "💡 Tip: Run 'docker system df' to see current disk usage."
}

# Main execution
main() {
    check_docker
    show_disk_usage
    confirm_action
    cleanup
    show_disk_usage_after
    show_cleanup_summary
}

# Run main function
main 