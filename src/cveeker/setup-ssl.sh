#!/bin/bash

# SSL Certificate Setup Script for cvilo.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Create SSL directory
create_ssl_directory() {
    print_status "Creating SSL directory..."
    mkdir -p nginx/ssl
    print_success "SSL directory created: nginx/ssl/"
}

# Generate self-signed certificate (for testing)
generate_self_signed() {
    print_status "Generating self-signed SSL certificate for cvilo.com..."
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/cvilo.com.key \
        -out nginx/ssl/cvilo.com.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=cvilo.com" \
        -addext "subjectAltName=DNS:cvilo.com,DNS:www.cvilo.com,DNS:localhost,IP:127.0.0.1"
    
    print_success "Self-signed certificate generated!"
    print_warning "This is for testing only. Use a proper SSL certificate for production."
}

# Instructions for Let's Encrypt
setup_lets_encrypt() {
    print_status "Setting up Let's Encrypt SSL certificate..."
    echo ""
    echo "To get a free SSL certificate from Let's Encrypt:"
    echo ""
    echo "1. Install certbot:"
    echo "   sudo apt-get install certbot"
    echo ""
    echo "2. Get certificate:"
    echo "   sudo certbot certonly --standalone -d cvilo.com -d www.cvilo.com"
    echo ""
    echo "3. Copy certificates to nginx/ssl/:"
    echo "   sudo cp /etc/letsencrypt/live/cvilo.com/fullchain.pem nginx/ssl/cvilo.com.crt"
    echo "   sudo cp /etc/letsencrypt/live/cvilo.com/privkey.pem nginx/ssl/cvilo.com.key"
    echo ""
    echo "4. Set proper permissions:"
    echo "   sudo chown -R \$USER:\$USER nginx/ssl/"
    echo "   chmod 600 nginx/ssl/cvilo.com.key"
    echo "   chmod 644 nginx/ssl/cvilo.com.crt"
    echo ""
    echo "5. Restart nginx:"
    echo "   docker-compose restart nginx"
    echo ""
}

# Instructions for commercial SSL
setup_commercial_ssl() {
    print_status "Setting up commercial SSL certificate..."
    echo ""
    echo "For a commercial SSL certificate:"
    echo ""
    echo "1. Purchase SSL certificate from your provider"
    echo "2. Download the certificate files"
    echo "3. Place them in nginx/ssl/:"
    echo "   - cvilo.com.crt (certificate file)"
    echo "   - cvilo.com.key (private key file)"
    echo ""
    echo "4. Set proper permissions:"
    echo "   chmod 600 nginx/ssl/cvilo.com.key"
    echo "   chmod 644 nginx/ssl/cvilo.com.crt"
    echo ""
    echo "5. Restart nginx:"
    echo "   docker-compose restart nginx"
    echo ""
}

# Check if certificates exist
check_certificates() {
    if [ -f "nginx/ssl/cvilo.com.crt" ] && [ -f "nginx/ssl/cvilo.com.key" ]; then
        print_success "SSL certificates found!"
        echo "Certificate: nginx/ssl/cvilo.com.crt"
        echo "Private Key: nginx/ssl/cvilo.com.key"
        return 0
    else
        print_warning "SSL certificates not found!"
        return 1
    fi
}

# Test SSL configuration
test_ssl() {
    print_status "Testing SSL configuration..."
    
    if check_certificates; then
        echo "Certificate details:"
        openssl x509 -in nginx/ssl/cvilo.com.crt -text -noout | grep -E "(Subject:|DNS:|IP Address:)"
        echo ""
        print_success "SSL certificates are valid!"
    else
        print_error "SSL certificates are missing!"
    fi
}

# Main script
case "${1:-help}" in
    "self-signed")
        create_ssl_directory
        generate_self_signed
        test_ssl
        ;;
    "lets-encrypt")
        create_ssl_directory
        setup_lets_encrypt
        ;;
    "commercial")
        create_ssl_directory
        setup_commercial_ssl
        ;;
    "test")
        test_ssl
        ;;
    "check")
        check_certificates
        ;;
    "help"|*)
        echo "SSL Certificate Setup for cvilo.com"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  self-signed    Generate self-signed certificate (for testing)"
        echo "  lets-encrypt   Show instructions for Let's Encrypt setup"
        echo "  commercial     Show instructions for commercial SSL setup"
        echo "  test           Test existing SSL certificates"
        echo "  check          Check if certificates exist"
        echo "  help           Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 self-signed    # Generate test certificate"
        echo "  $0 lets-encrypt   # Show Let's Encrypt instructions"
        echo "  $0 test           # Test existing certificates"
        ;;
esac 