#!/bin/bash

# Docker Cleanup Script - Refactored
# ==================================
#
# Usage:
#   ./docker-cleanup.sh [COMMAND] [OPTIONS]
#
# Commands:
#   remove_db                    - Remove database containers and volumes
#   image=<image_name>           - Remove specific image and its containers
#   container=<container_name>   - Remove specific container
#   all                         - Remove all containers, images, networks (preserve volumes)
#   full                        - Remove everything including volumes (DANGEROUS!)
#   help                        - Show this help message
#
# Examples:
#   ./docker-cleanup.sh remove_db
#   ./docker-cleanup.sh image=cvilo-api
#   ./docker-cleanup.sh container=cvilo-api
#   ./docker-cleanup.sh all
#   ./docker-cleanup.sh full

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to show help
show_help() {
    echo "🧹 Docker Cleanup Script"
    echo "========================"
    echo ""
    echo "Usage:"
    echo "  ./docker-cleanup.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  remove_db                    - Remove database containers and volumes"
    echo "  image=<image_name>           - Remove specific image and its containers"
    echo "  container=<container_name>   - Remove specific container"
    echo "  all                         - Remove all containers, images, networks (preserve volumes)"
    echo "  full                        - Remove everything including volumes (DANGEROUS!)"
    echo "  help                        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-cleanup.sh remove_db"
    echo "  ./docker-cleanup.sh image=cvilo-api"
    echo "  ./docker-cleanup.sh container=cvilo-api"
    echo "  ./docker-cleanup.sh all"
    echo "  ./docker-cleanup.sh full"
    echo ""
    echo "Environment Variables:"
    echo "  NON_INTERACTIVE=true        - Skip confirmation prompts"
    echo "  FORCE=true                  - Skip all confirmations (use with caution)"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_status $RED "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to confirm action
confirm_action() {
    local message=$1
    if [ "$NON_INTERACTIVE" = "true" ] || [ "$FORCE" = "true" ]; then
        return 0
    fi
    
    echo ""
    read -p "${message} (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status $YELLOW "❌ Operation cancelled."
        exit 1
    fi
}

# Function to remove database
remove_database() {
    print_status $BLUE "🗄️  Removing database containers and volumes..."
    
    # Stop and remove postgres containers
    print_status $YELLOW "🛑 Stopping database containers..."
    docker-compose down --volumes 2>/dev/null || true
    docker-compose -f docker-compose.yml down --volumes 2>/dev/null || true
    
    # Remove postgres containers by name
    docker container stop cvilo_postgres 2>/dev/null || true
    docker container stop cvilo_postgres_dev 2>/dev/null || true
    docker container rm cvilo_postgres 2>/dev/null || true
    docker container rm cvilo_postgres_dev 2>/dev/null || true
    
    # Remove postgres volumes
    print_status $YELLOW "🗑️  Removing database volumes..."
    docker volume rm cveeker_postgres_data 2>/dev/null || true
    docker volume rm cveeker_postgres_data_dev 2>/dev/null || true
    
    print_status $GREEN "✅ Database containers and volumes removed successfully!"
}

# Function to remove specific image and its containers
remove_image() {
    local image_name=$1
    
    print_status $BLUE "🎯 Removing image: $image_name"
    
    # Find containers using this image
    local containers=$(docker ps -a --filter "ancestor=$image_name" --format "{{.Names}}")
    
    if [ -n "$containers" ]; then
        print_status $YELLOW "🛑 Stopping and removing containers using image $image_name:"
        echo "$containers" | while read container; do
            if [ -n "$container" ]; then
                print_status $YELLOW "   🛑 Stopping: $container"
                docker container stop "$container" 2>/dev/null || true
                print_status $YELLOW "   🗑️  Removing: $container"
                docker container rm "$container" 2>/dev/null || true
            fi
        done
    fi
    
    # Remove the image
    print_status $YELLOW "🗑️  Removing image: $image_name"
    docker image rm "$image_name" 2>/dev/null || print_status $RED "   ⚠️  Image $image_name not found or could not be removed"
    
    print_status $GREEN "✅ Image $image_name and its containers removed successfully!"
}

# Function to remove specific container
remove_container() {
    local container_name=$1
    
    print_status $BLUE "🎯 Removing container: $container_name"
    
    print_status $YELLOW "🛑 Stopping container: $container_name"
    docker container stop "$container_name" 2>/dev/null || print_status $YELLOW "   ⚠️  Container $container_name not found or already stopped"
    
    print_status $YELLOW "🗑️  Removing container: $container_name"
    docker container rm "$container_name" 2>/dev/null || print_status $RED "   ⚠️  Container $container_name not found or could not be removed"
    
    print_status $GREEN "✅ Container $container_name removed successfully!"
}

# Function to remove all containers and images (preserve volumes)
remove_all() {
    print_status $BLUE "🧹 Removing all containers, images, and networks (preserving volumes)..."
    
    confirm_action "⚠️  This will remove ALL Docker containers, images, and networks. Continue?"
    
    # Stop and remove all containers
    print_status $YELLOW "🛑 Stopping all containers..."
    docker container stop $(docker container ls -aq) 2>/dev/null || true
    
    print_status $YELLOW "🗑️  Removing all containers..."
    docker container rm $(docker container ls -aq) 2>/dev/null || true
    
    # Remove all images
    print_status $YELLOW "🗑️  Removing all images..."
    docker image rm $(docker image ls -aq) 2>/dev/null || true
    
    # Remove networks
    print_status $YELLOW "🗑️  Removing unused networks..."
    docker network prune -f
    
    # Clear build cache
    print_status $YELLOW "🗑️  Clearing build cache..."
    docker builder prune -af
    
    # System prune (preserve volumes)
    print_status $YELLOW "🗑️  Final system cleanup..."
    docker system prune -af
    
    print_status $GREEN "✅ All containers, images, and networks removed successfully!"
}

# Function to remove everything including volumes
remove_full() {
    print_status $RED "🚨 DANGEROUS: Removing everything including volumes!"
    
    confirm_action "⚠️  This will remove ALL Docker containers, images, networks, AND volumes. ALL DATA WILL BE LOST! Continue?"
    
    confirm_action "⚠️  Are you absolutely sure? This cannot be undone!"
    
    # Stop and remove all containers
    print_status $YELLOW "🛑 Stopping all containers..."
    docker container stop $(docker container ls -aq) 2>/dev/null || true
    
    print_status $YELLOW "🗑️  Removing all containers..."
    docker container rm $(docker container ls -aq) 2>/dev/null || true
    
    # Remove all images
    print_status $YELLOW "🗑️  Removing all images..."
    docker image rm $(docker image ls -aq) 2>/dev/null || true
    
    # Remove networks
    print_status $YELLOW "🗑️  Removing unused networks..."
    docker network prune -f
    
    # Remove volumes
    print_status $YELLOW "🗑️  Removing all volumes..."
    docker volume prune -f
    
    # Clear build cache
    print_status $YELLOW "🗑️  Clearing build cache..."
    docker builder prune -af
    
    # System prune with volumes
    print_status $YELLOW "🗑️  Final system cleanup..."
    docker system prune -af --volumes
    
    print_status $GREEN "✅ Everything removed successfully!"
}

# Function to show disk usage
show_disk_usage() {
    echo ""
    print_status $BLUE "📊 Current Docker disk usage:"
    docker system df
    echo ""
}

# Main script logic
main() {
    # Check if Docker is running
    check_docker
    
    # Show disk usage before cleanup
    show_disk_usage
    
    # Parse command line arguments
    local command=${1:-help}
    
    case $command in
        "remove_db")
            remove_database
            ;;
        "image="*)
            local image_name=${command#image=}
            if [ -z "$image_name" ]; then
                print_status $RED "❌ Error: Image name is required. Usage: ./docker-cleanup.sh image=<image_name>"
                exit 1
            fi
            remove_image "$image_name"
            ;;
        "container="*)
            local container_name=${command#container=}
            if [ -z "$container_name" ]; then
                print_status $RED "❌ Error: Container name is required. Usage: ./docker-cleanup.sh container=<container_name>"
                exit 1
            fi
            remove_container "$container_name"
            ;;
        "all")
            remove_all
            ;;
        "full")
            remove_full
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_status $RED "❌ Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    # Show disk usage after cleanup
    show_disk_usage
    
    print_status $GREEN "🎉 Cleanup completed successfully!"
}

# Run main function with all arguments
main "$@" 