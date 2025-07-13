#!/bin/bash

# CVilo Monorepo Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to build and start all services
start_production() {
    print_status "Starting CVilo monorepo in production mode..."
    check_docker
    
    docker-compose up --build -d
    print_success "All services started successfully!"
    print_status "Access the application at: http://localhost"
    print_status "Dashboard: http://localhost/dashboard"
    print_status "API Docs: http://localhost/api/docs"
}

# Function to start in development mode
start_development() {
    print_status "Starting CVilo monorepo in development mode..."
    check_docker
    
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
    print_success "All services started in development mode!"
    print_status "Access the application at: http://localhost"
    print_status "Dashboard: http://localhost/dashboard"
    print_status "API Docs: http://localhost/api/docs"
    print_warning "Hot reloading is enabled for development"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped!"
}

# Function to restart all services
restart_services() {
    print_status "Restarting all services..."
    docker-compose restart
    print_success "All services restarted!"
}

# Function to rebuild and restart
rebuild_services() {
    print_status "Rebuilding and restarting all services..."
    docker-compose down
    docker-compose up --build -d
    print_success "All services rebuilt and restarted!"
}

# Function to view logs
view_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    fi
}

# Function to access a container
access_container() {
    local service=${1:-"cvilo-api"}
    print_status "Accessing $service container..."
    docker-compose exec "$service" sh
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed!"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to show resource usage
show_resources() {
    print_status "Resource usage:"
    docker stats --no-stream
}

# Function to backup database
backup_database() {
    local backup_file="cvilo_backup_$(date +%Y%m%d_%H%M%S).db"
    print_status "Creating database backup: $backup_file"
    docker-compose exec cvilo-api sqlite3 /app/cvilo.db ".backup '/app/$backup_file'"
    docker cp "$(docker-compose ps -q cvilo-api):/app/$backup_file" "./$backup_file"
    print_success "Database backed up to: $backup_file"
}

# Function to restore database
restore_database() {
    local backup_file=${1:-""}
    if [ -z "$backup_file" ]; then
        print_error "Please provide a backup file name"
        echo "Usage: $0 restore-db <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file $backup_file not found"
        exit 1
    fi
    
    print_status "Restoring database from: $backup_file"
    docker cp "$backup_file" "$(docker-compose ps -q cvilo-api):/app/restore.db"
    docker-compose exec cvilo-api sqlite3 /app/cvilo.db ".restore '/app/restore.db'"
    docker-compose restart cvilo-api
    print_success "Database restored successfully!"
}

# Function to show help
show_help() {
    echo "CVilo Monorepo Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start-prod     Start all services in production mode"
    echo "  start-dev      Start all services in development mode"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  rebuild        Rebuild and restart all services"
    echo "  logs [SERVICE] View logs (all services or specific service)"
    echo "  access [SERVICE] Access container shell (default: cvilo-api)"
    echo "  status         Show service status"
    echo "  resources      Show resource usage"
    echo "  cleanup        Clean up Docker resources"
    echo "  backup-db      Backup database"
    echo "  restore-db     Restore database from backup"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-prod"
    echo "  $0 logs cvilo-api"
    echo "  $0 access cvilo-clientarea"
    echo "  $0 backup-db"
    echo "  $0 restore-db cvilo_backup_20231201_143022.db"
}

# Main script logic
case "${1:-help}" in
    "start-prod")
        start_production
        ;;
    "start-dev")
        start_development
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "rebuild")
        rebuild_services
        ;;
    "logs")
        view_logs "$2"
        ;;
    "access")
        access_container "$2"
        ;;
    "status")
        show_status
        ;;
    "resources")
        show_resources
        ;;
    "cleanup")
        cleanup
        ;;
    "backup-db")
        backup_database
        ;;
    "restore-db")
        restore_database "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac 