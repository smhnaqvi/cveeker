package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/services"
	"github.com/smhnaqvi/cvilo/utils"
)

type AuthController struct {
	authService *services.AuthService
	validate    *validator.Validate
}

func NewAuthController() *AuthController {
	return &AuthController{
		authService: services.NewAuthService(),
		validate:    validator.New(),
	}
}

// Login handles user login
func (ac *AuthController) Login(c *gin.Context) {
	var loginReq models.LoginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		utils.BadRequest(c, "Invalid request body", err.Error())
		return
	}

	// Validate request
	if err := ac.validate.Struct(loginReq); err != nil {
		utils.BadRequest(c, "Validation failed", err.Error())
		return
	}

	// Authenticate user
	user, err := ac.authService.AuthenticateUser(loginReq.Email, loginReq.Password)
	if err != nil {
		utils.Unauthorized(c, "Authentication failed")
		return
	}

	// Generate token pair
	tokenPair, err := ac.authService.GenerateTokenPair(*user)
	if err != nil {
		utils.InternalError(c, "Failed to generate tokens", err.Error())
		return
	}

	// Return token pair and user data

	utils.Success(c, "Login successful", gin.H{
		"access_token":  tokenPair.AccessToken,
		"refresh_token": tokenPair.RefreshToken,
		"user":          user.ToUserResponse(),
		"expires_at":    tokenPair.ExpiresAt,
	})
}

// Register handles user registration
func (ac *AuthController) Register(c *gin.Context) {
	var registerReq models.RegisterRequest

	if err := c.ShouldBindJSON(&registerReq); err != nil {
		utils.BadRequest(c, "Invalid request body", err.Error())
		return
	}

	// Validate request
	if err := ac.validate.Struct(registerReq); err != nil {
		utils.BadRequest(c, "Validation failed", err.Error())
		return
	}

	// Register user
	user, err := ac.authService.RegisterUser(registerReq)
	if err != nil {
		utils.BadRequest(c, "Registration failed", err.Error())
		return
	}

	// Generate token pair
	tokenPair, err := ac.authService.GenerateTokenPair(*user)
	if err != nil {
		utils.InternalError(c, "Failed to generate tokens", err.Error())
		return
	}

	// Return token pair and user data
	utils.Created(c, "Registration successful", gin.H{
		"access_token":  tokenPair.AccessToken,
		"refresh_token": tokenPair.RefreshToken,
		"user":          user.ToUserResponse(),
		"expires_at":    tokenPair.ExpiresAt,
	})
}

// Me returns the current authenticated user
func (ac *AuthController) Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "User not authenticated")
		return
	}

	var user models.UserModel
	if err := user.GetUserByID(userID.(uint)); err != nil {
		utils.NotFound(c, "User not found")
		return
	}

	utils.Success(c, "User profile retrieved", user.ToUserResponse())
}

// ChangePassword handles password change for authenticated users
func (ac *AuthController) ChangePassword(c *gin.Context) {
	var passwordReq models.PasswordChangeRequest

	if err := c.ShouldBindJSON(&passwordReq); err != nil {
		utils.BadRequest(c, "Invalid request body", err.Error())
		return
	}

	// Validate request
	if err := ac.validate.Struct(passwordReq); err != nil {
		utils.BadRequest(c, "Validation failed", err.Error())
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "User not authenticated")
		return
	}

	// Change password
	err := ac.authService.ChangePassword(userID.(uint), passwordReq.CurrentPassword, passwordReq.NewPassword)
	if err != nil {
		utils.BadRequest(c, "Password change failed", err.Error())
		return
	}

	utils.Success(c, "Password changed successfully", gin.H{"message": "Password changed successfully"})
}

// RefreshToken handles token refresh using refresh token
func (ac *AuthController) RefreshToken(c *gin.Context) {
	var refreshReq struct {
		RefreshToken string `json:"refresh_token" validate:"required"`
	}

	if err := c.ShouldBindJSON(&refreshReq); err != nil {
		utils.BadRequest(c, "Invalid request body", err.Error())
		return
	}

	// Validate refresh token
	claims, err := ac.authService.ValidateJWT(refreshReq.RefreshToken)
	if err != nil {
		utils.Unauthorized(c, "Invalid refresh token")
		return
	}

	// Get user from database
	var user models.UserModel
	if err := user.GetUserByID(claims.UserID); err != nil {
		utils.NotFound(c, "User not found")
		return
	}

	// Generate new token pair
	tokenPair, err := ac.authService.GenerateTokenPair(user)
	if err != nil {
		utils.InternalError(c, "Failed to generate tokens", err.Error())
		return
	}

	// Generate new token pair

	utils.Success(c, "Tokens refreshed successfully", gin.H{
		"access_token":  tokenPair.AccessToken,
		"refresh_token": tokenPair.RefreshToken,
		"user":          user.ToUserResponse(),
		"expires_at":    tokenPair.ExpiresAt,
	})
}

// VerifyToken verifies if a token is valid
func (ac *AuthController) VerifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		utils.Unauthorized(c, "Authorization header is required")
		return
	}

	// Extract token from "Bearer <token>"
	if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
		utils.Unauthorized(c, "Authorization header must start with 'Bearer '")
		return
	}

	tokenString := authHeader[7:]

	// Validate token
	claims, err := ac.authService.ValidateJWT(tokenString)
	if err != nil {
		utils.Unauthorized(c, "Invalid token")
		return
	}

	utils.Success(c, "Token is valid", gin.H{
		"valid":   true,
		"user_id": claims.UserID,
		"email":   claims.Email,
		"role":    claims.Role,
	})
}
