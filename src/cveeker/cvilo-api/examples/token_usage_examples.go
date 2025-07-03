package main

import (
	"fmt"
	"log"

	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
	"github.com/smhnaqvi/cvilo/utils"
)

// Example 1: Generate tokens for a user after login
func exampleLoginFlow() {
	// Simulate user login
	user := models.UserModel{
		ID:    1,
		Email: "user@example.com",
		Name:  "John Doe",
	}

	// Generate token pair
	authService := services.NewAuthService()
	tokenPair, err := authService.GenerateTokenPair(user)
	if err != nil {
		log.Fatal("Failed to generate tokens:", err)
	}

	fmt.Printf("Access Token: %s\n", tokenPair.AccessToken)
	fmt.Printf("Refresh Token: %s\n", tokenPair.RefreshToken)
	fmt.Printf("Expires At: %s\n", tokenPair.ExpiresAt)
}

// Example 2: Using utility functions
func exampleUtilityFunctions() {
	// Simulate user
	user := models.UserModel{
		ID:    2,
		Email: "jane@example.com",
		Name:  "Jane Smith",
	}

	// Generate tokens using utility function
	tokenPair, err := utils.GenerateTokensForUser(user)
	if err != nil {
		log.Fatal("Failed to generate tokens:", err)
	}

	fmt.Printf("Generated tokens for user %s\n", user.Email)
	fmt.Printf("Access Token: %s\n", tokenPair.AccessToken[:20]+"...")
	fmt.Printf("Refresh Token: %s\n", tokenPair.RefreshToken[:20]+"...")

	// Generate only access token
	accessToken, err := utils.GenerateAccessTokenForUser(user)
	if err != nil {
		log.Fatal("Failed to generate access token:", err)
	}

	fmt.Printf("Access Token Only: %s\n", accessToken[:20]+"...")
}

// Example 3: Token validation and user retrieval
func exampleTokenValidation() {
	// Simulate a token (in real scenario, this would come from a request)
	user := models.UserModel{
		ID:    3,
		Email: "bob@example.com",
		Name:  "Bob Johnson",
	}

	authService := services.NewAuthService()
	token, err := authService.GenerateJWT(user)
	if err != nil {
		log.Fatal("Failed to generate token:", err)
	}

	// Validate token
	claims, err := utils.ValidateUserToken(token)
	if err != nil {
		log.Fatal("Failed to validate token:", err)
	}

	fmt.Printf("Token is valid for user ID: %d\n", claims.UserID)
	fmt.Printf("User email: %s\n", claims.Email)

	// Get user from token
	userFromToken, err := utils.GetUserFromToken(token)
	if err != nil {
		log.Fatal("Failed to get user from token:", err)
	}

	fmt.Printf("Retrieved user: %s (%s)\n", userFromToken.Name, userFromToken.Email)
}

// Example 4: Refresh token flow
func exampleRefreshTokenFlow() {
	// Simulate user
	user := models.UserModel{
		ID:    4,
		Email: "alice@example.com",
		Name:  "Alice Brown",
	}

	// Generate initial token pair
	authService := services.NewAuthService()
	initialTokens, err := authService.GenerateTokenPair(user)
	if err != nil {
		log.Fatal("Failed to generate initial tokens:", err)
	}

	fmt.Printf("Initial Access Token: %s\n", initialTokens.AccessToken[:20]+"...")
	fmt.Printf("Initial Refresh Token: %s\n", initialTokens.RefreshToken[:20]+"...")

	// Simulate token refresh
	newTokens, err := authService.GenerateTokenPair(user)
	if err != nil {
		log.Fatal("Failed to generate new tokens:", err)
	}

	fmt.Printf("New Access Token: %s\n", newTokens.AccessToken[:20]+"...")
	fmt.Printf("New Refresh Token: %s\n", newTokens.RefreshToken[:20]+"...")
}

// Example 5: Using tokens in different scenarios
func exampleDifferentScenarios() {
	user := models.UserModel{
		ID:    5,
		Email: "admin@example.com",
		Name:  "Admin User",
	}

	// Scenario 1: API call that needs short-lived token
	accessToken, err := utils.GenerateAccessTokenForUser(user)
	if err != nil {
		log.Fatal("Failed to generate access token:", err)
	}
	fmt.Printf("API Call Token: %s\n", accessToken[:20]+"...")

	// Scenario 2: User session that needs both tokens
	tokenPair, err := utils.GenerateTokensForUser(user)
	if err != nil {
		log.Fatal("Failed to generate token pair:", err)
	}
	fmt.Printf("Session Access Token: %s\n", tokenPair.AccessToken[:20]+"...")
	fmt.Printf("Session Refresh Token: %s\n", tokenPair.RefreshToken[:20]+"...")

	// Scenario 3: One-time operation token
	oneTimeToken, err := utils.GenerateAccessTokenForUser(user)
	if err != nil {
		log.Fatal("Failed to generate one-time token:", err)
	}
	fmt.Printf("One-time Token: %s\n", oneTimeToken[:20]+"...")
}

func main() {
	fmt.Println("=== Token Generation Examples ===\n")

	fmt.Println("1. Login Flow Example:")
	exampleLoginFlow()
	fmt.Println()

	fmt.Println("2. Utility Functions Example:")
	exampleUtilityFunctions()
	fmt.Println()

	fmt.Println("3. Token Validation Example:")
	exampleTokenValidation()
	fmt.Println()

	fmt.Println("4. Refresh Token Flow Example:")
	exampleRefreshTokenFlow()
	fmt.Println()

	fmt.Println("5. Different Scenarios Example:")
	exampleDifferentScenarios()
	fmt.Println()

	fmt.Println("=== Examples Completed ===")
}
