#!/bin/bash

# Test script for authentication endpoints
BASE_URL="http://localhost:8081/api/v1"

echo "Testing Authentication Endpoints"
echo "================================="

# Test registration
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Registration Response: $REGISTER_RESPONSE"
echo ""

# Test login
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo ""

# Extract access token from login response
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
    echo "3. Testing protected endpoint (me)..."
    ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "Me Response: $ME_RESPONSE"
    echo ""
    
    echo "4. Testing token verification..."
    VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/verify" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "Verify Response: $VERIFY_RESPONSE"
    echo ""
    
    if [ -n "$REFRESH_TOKEN" ]; then
        echo "5. Testing token refresh..."
        REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
          -H "Content-Type: application/json" \
          -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}")
        
        echo "Refresh Response: $REFRESH_RESPONSE"
        echo ""
    fi
else
    echo "No tokens received from login, skipping protected endpoint tests"
fi

echo "Test completed!" 