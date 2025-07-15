#!/bin/bash

echo "🧹 Docker Cleanup Script"
echo "========================"

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
    echo "   - All containers for this project"
    echo "   - All networks for this project"
    echo "   - All volumes for this project (including database data)"
    echo "   - All unused Docker resources (images, containers, networks, build cache)"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cleanup cancelled."
        exit 1
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
    echo "🛑 Stopping and removing all containers, networks, and volumes for this project..."
    docker-compose down --volumes --remove-orphans
    
    if [ $? -eq 0 ]; then
        echo "✅ Project containers, networks, and volumes removed successfully."
    else
        echo "⚠️  Some containers may not have been removed (this is normal if they weren't running)."
    fi
    
    echo ""
    echo "🗑️  Pruning unused Docker resources..."
    echo "   - Dangling images"
    echo "   - Stopped containers"
    echo "   - Unused networks"
    echo "   - Build cache"
    
    docker system prune -f
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker system prune completed successfully."
    else
        echo "❌ Error during Docker system prune."
        exit 1
    fi
}

# Function to show what was cleaned up
show_cleanup_summary() {
    echo ""
    echo "🎉 Cleanup Summary:"
    echo "   ✅ Project containers stopped and removed"
    echo "   ✅ Project networks removed"
    echo "   ✅ Project volumes removed (database data cleared)"
    echo "   ✅ Unused Docker resources pruned"
    echo ""
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