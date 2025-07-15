package utils

import (
	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
)

// GenerateTokensForUser is a utility function to generate access and refresh tokens for a user
// This function can be used anywhere in the codebase where you need to generate tokens
func GenerateTokensForUser(user models.UserModel) (*services.TokenPair, error) {
	authService := services.NewAuthService()
	return authService.GenerateTokenPair(user)
}

// GenerateAccessTokenForUser is a utility function to generate only an access token for a user
// This is useful for scenarios where you only need a short-lived token
func GenerateAccessTokenForUser(user models.UserModel) (string, error) {
	authService := services.NewAuthService()
	return authService.GenerateJWT(user)
}

// ValidateUserToken is a utility function to validate a JWT token and return user claims
func ValidateUserToken(tokenString string) (*models.JWTClaims, error) {
	authService := services.NewAuthService()
	return authService.ValidateJWT(tokenString)
}

// GetUserFromToken is a utility function to get a user model from a JWT token
func GetUserFromToken(tokenString string) (*models.UserModel, error) {
	authService := services.NewAuthService()

	// Validate token
	claims, err := authService.ValidateJWT(tokenString)
	if err != nil {
		return nil, err
	}

	// Get user from database
	var user models.UserModel
	if err := user.GetUserByID(claims.UserID); err != nil {
		return nil, err
	}

	return &user, nil
}
