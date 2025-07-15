#!/bin/bash

# Deployment script for CVilo subdomain structure
# This script deploys all services with the new subdomain configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying CVilo with Subdomain Structure${NC}"
echo "================================================"
echo -e "${YELLOW}Structure:${NC}"
echo "  - cvilo.com → Landing page (Next.js)"
echo "  - api.cvilo.com → API service (Go)"
echo "  - app.cvilo.com → Client dashboard (React)"
echo ""

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose >/dev/null 2>&1; then
        echo -e "${RED}❌ docker-compose not found. Please install docker-compose.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ docker-compose is available${NC}"
}

# Function to validate nginx configuration
validate_nginx() {
    echo -e "\n${YELLOW}Validating Nginx configuration...${NC}"
    if [ -f "nginx/nginx.dev.conf" ]; then
        if docker run --rm -v "$(pwd)/nginx/nginx.dev.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t 2>/dev/null; then
            echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
        else
            echo -e "${RED}❌ Nginx configuration has errors${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ nginx.dev.conf not found${NC}"
        exit 1
    fi
}

# Function to check SSL certificates
check_ssl_certificates() {
    echo -e "\n${YELLOW}Checking SSL certificates...${NC}"
    echo -e "${GREEN}✅ Using development configuration (no SSL required)${NC}"
}

# Function to stop existing services
stop_services() {
    echo -e "\n${YELLOW}Stopping existing services...${NC}"
    docker-compose down --remove-orphans
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Function to build services
build_services() {
    echo -e "\n${YELLOW}Building services...${NC}"
    
    # Build API service
    echo -e "${BLUE}Building API service...${NC}"
    docker-compose build cvilo-api
    
    # Build client area
    echo -e "${BLUE}Building client area...${NC}"
    docker-compose build cvilo-clientarea
    
    # Build landing page
    echo -e "${BLUE}Building landing page...${NC}"
    docker-compose build cvilo-landing-nextjs
    
    echo -e "${GREEN}✅ All services built${NC}"
}

# Function to start services
start_services() {
    echo -e "\n${YELLOW}Starting services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Services started${NC}"
}

# Function to check service health
check_health() {
    echo -e "\n${YELLOW}Checking service health...${NC}"
    
    # Wait a bit for services to start
    sleep 10
    
    # Check API health
    if curl -s http://localhost/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ API service is healthy${NC}"
    else
        echo -e "${RED}❌ API service is not responding${NC}"
    fi
    
    # Check client area health
    if curl -s http://localhost/dashboard/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Client area is healthy${NC}"
    else
        echo -e "${RED}❌ Client area is not responding${NC}"
    fi
    
    # Check landing page health
    if curl -s http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Landing page is healthy${NC}"
    else
        echo -e "${RED}❌ Landing page is not responding${NC}"
    fi
}

# Function to show service status
show_status() {
    echo -e "\n${YELLOW}Service Status:${NC}"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Function to show access URLs
show_urls() {
    echo -e "\n${YELLOW}Access URLs:${NC}"
    echo -e "${BLUE}Development (localhost):${NC}"
    echo "  - Landing page: http://localhost"
    echo "  - API: http://localhost/api"
    echo "  - App: http://localhost/dashboard"
    echo ""
    echo -e "${BLUE}Production (after DNS setup):${NC}"
    echo "  - Landing page: https://cvilo.com"
    echo "  - API: https://api.cvilo.com"
    echo "  - App: https://app.cvilo.com"
}

# Function to show next steps
show_next_steps() {
    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo "1. Configure DNS records in Cloudflare:"
    echo "   - cvilo.com → YOUR_SERVER_IP"
    echo "   - api.cvilo.com → YOUR_SERVER_IP"
    echo "   - app.cvilo.com → YOUR_SERVER_IP"
    echo ""
    echo "2. Set up SSL certificates for production"
    echo "3. Configure Cloudflare page rules (see CLOUDFLARE_SUBDOMAIN_SETUP.md)"
    echo "4. Test all endpoints after DNS propagation"
    echo ""
    echo "5. Run the test script: ./test-subdomains.sh"
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment...${NC}"
    
    # Pre-flight checks
    check_docker
    check_docker_compose
    validate_nginx
    check_ssl_certificates
    
    # Deployment steps
    stop_services
    build_services
    start_services
    check_health
    show_status
    show_urls
    show_next_steps
    
    echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
}

# Handle command line arguments
case "${1:-}" in
    "stop")
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down --remove-orphans
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    "restart")
        echo -e "${YELLOW}Restarting all services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
    "logs")
        echo -e "${YELLOW}Showing service logs...${NC}"
        docker-compose logs -f
        ;;
    "status")
        show_status
        ;;
    "health")
        check_health
        ;;
    "test")
        echo -e "${YELLOW}Running test script...${NC}"
        ./test-subdomains.sh
        ;;
    *)
        main
        ;;
esac 