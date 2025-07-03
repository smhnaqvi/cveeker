package main

import (
	"fmt"
	"log"

	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
	"github.com/smhnaqvi/cvilo/utils"
)

func testTokenGeneration() {
	fmt.Println("Testing Token Generation Functions")
	fmt.Println("==================================")

	// Create a test user
	user := models.UserModel{
		ID:    1,
		Email: "test@example.com",
		Name:  "Test User",
	}

	// Test 1: Generate token pair
	fmt.Println("\n1. Testing GenerateTokenPair...")
	authService := services.NewAuthService()
	tokenPair, err := authService.GenerateTokenPair(user)
	if err != nil {
		log.Fatal("Failed to generate token pair:", err)
	}

	fmt.Printf("✓ Access Token: %s...\n", tokenPair.AccessToken[:20])
	fmt.Printf("✓ Refresh Token: %s...\n", tokenPair.RefreshToken[:20])
	fmt.Printf("✓ Expires At: %s\n", tokenPair.ExpiresAt)

	// Test 2: Generate access token only
	fmt.Println("\n2. Testing GenerateAccessTokenForUser...")
	accessToken, err := utils.GenerateAccessTokenForUser(user)
	if err != nil {
		log.Fatal("Failed to generate access token:", err)
	}

	fmt.Printf("✓ Access Token: %s...\n", accessToken[:20])

	// Test 3: Validate token
	fmt.Println("\n3. Testing ValidateUserToken...")
	claims, err := utils.ValidateUserToken(accessToken)
	if err != nil {
		log.Fatal("Failed to validate token:", err)
	}

	fmt.Printf("✓ Token is valid for user ID: %d\n", claims.UserID)
	fmt.Printf("✓ User email: %s\n", claims.Email)

	// Test 4: Get user from token
	fmt.Println("\n4. Testing GetUserFromToken...")
	userFromToken, err := utils.GetUserFromToken(accessToken)
	if err != nil {
		log.Fatal("Failed to get user from token:", err)
	}

	fmt.Printf("✓ Retrieved user: %s (%s)\n", userFromToken.Name, userFromToken.Email)

	// Test 5: Generate tokens using utility function
	fmt.Println("\n5. Testing GenerateTokensForUser utility...")
	tokenPair2, err := utils.GenerateTokensForUser(user)
	if err != nil {
		log.Fatal("Failed to generate tokens using utility:", err)
	}

	fmt.Printf("✓ Generated tokens for user %s\n", user.Email)
	fmt.Printf("✓ Access Token: %s...\n", tokenPair2.AccessToken[:20])
	fmt.Printf("✓ Refresh Token: %s...\n", tokenPair2.RefreshToken[:20])

	fmt.Println("\n✅ All token generation tests passed!")
	fmt.Println("\nYou can now use these functions in your application:")
	fmt.Println("- authService.GenerateTokenPair(user) - Generate access + refresh tokens")
	fmt.Println("- utils.GenerateTokensForUser(user) - Utility function for token pair")
	fmt.Println("- utils.GenerateAccessTokenForUser(user) - Generate access token only")
	fmt.Println("- utils.ValidateUserToken(token) - Validate a token")
	fmt.Println("- utils.GetUserFromToken(token) - Get user from token")
}
