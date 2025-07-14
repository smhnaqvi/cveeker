#!/bin/bash

# Test script for subdomain setup
# This script tests the new subdomain structure:
# - cvilo.com -> Landing page
# - api.cvilo.com -> API service  
# - app.cvilo.com -> Client dashboard

echo "🧪 Testing CVilo Subdomain Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test URL
test_url() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "URL: $url"
    
    # Test HTTP response
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ Success: HTTP $response${NC}"
    else
        echo -e "${RED}❌ Failed: Expected $expected_status, got $response${NC}"
    fi
    
    # Test SSL certificate
    if [[ $url == https://* ]]; then
        ssl_test=$(echo | openssl s_client -connect "${url#https://}:443" -servername "${url#https://}" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ SSL Certificate: Valid${NC}"
        else
            echo -e "${RED}❌ SSL Certificate: Invalid or missing${NC}"
        fi
    fi
}

# Test localhost endpoints (for development)
echo -e "\n${YELLOW}Testing Localhost Endpoints (Development)${NC}"
echo "=================================================="

test_url "http://localhost/health" "Main domain health check"
test_url "http://localhost/api/health" "API health check"
test_url "http://localhost/dashboard/" "App dashboard"

# Test subdomain endpoints (for production)
echo -e "\n${YELLOW}Testing Subdomain Endpoints (Production)${NC}"
echo "=================================================="

# Check if we can resolve the domains
echo -e "\n${YELLOW}DNS Resolution Test${NC}"
for domain in "cvilo.com" "api.cvilo.com" "app.cvilo.com"; do
    if nslookup "$domain" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $domain: Resolves${NC}"
    else
        echo -e "${RED}❌ $domain: Does not resolve${NC}"
    fi
done

# Test HTTPS endpoints (if domains are accessible)
echo -e "\n${YELLOW}HTTPS Endpoint Tests${NC}"
echo "=============================="

test_url "https://cvilo.com/health" "Landing page health check"
test_url "https://api.cvilo.com/health" "API health check"
test_url "https://app.cvilo.com/health" "App health check"

# Test main pages
echo -e "\n${YELLOW}Main Page Tests${NC}"
echo "=================="

test_url "https://cvilo.com" "Landing page"
test_url "https://api.cvilo.com" "API root"
test_url "https://app.cvilo.com" "App dashboard"

# Docker service status
echo -e "\n${YELLOW}Docker Service Status${NC}"
echo "======================"

if command -v docker-compose >/dev/null 2>&1; then
    cd "$(dirname "$0")"
    echo "Checking Docker services..."
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
else
    echo -e "${RED}❌ docker-compose not found${NC}"
fi

# Nginx configuration test
echo -e "\n${YELLOW}Nginx Configuration Test${NC}"
echo "=============================="

if [ -f "nginx/nginx.conf" ]; then
    if docker run --rm -v "$(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t 2>/dev/null; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    else
        echo -e "${RED}❌ Nginx configuration has errors${NC}"
    fi
else
    echo -e "${RED}❌ nginx.conf not found${NC}"
fi

echo -e "\n${GREEN}🎉 Testing complete!${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Configure DNS records in Cloudflare"
echo "2. Set up SSL certificates"
echo "3. Configure Cloudflare page rules"
echo "4. Test all endpoints after DNS propagation"
echo -e "\nSee CLOUDFLARE_SUBDOMAIN_SETUP.md for detailed configuration instructions." 