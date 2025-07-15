# Token Generation Functions Guide

This guide explains how to use the token generation functions in the Cvilo API.

## Overview

The API provides several functions to generate JWT tokens for users. These functions can be used in various scenarios like login, registration, token refresh, and other authentication flows.

## Available Functions

### 1. GenerateTokenPair (Recommended)

Generates both access and refresh tokens for a user.

```go
func (s *AuthService) GenerateTokenPair(user models.UserModel) (*TokenPair, error)
```

**Usage:**
```go
authService := services.NewAuthService()
tokenPair, err := authService.GenerateTokenPair(user)
if err != nil {
    // Handle error
}

// Access tokens
accessToken := tokenPair.AccessToken    // 15 minutes expiry
refreshToken := tokenPair.RefreshToken  // 7 days expiry
expiresAt := tokenPair.ExpiresAt        // Access token expiry time
```

**Response Structure:**
```go
type TokenPair struct {
    AccessToken  string    `json:"access_token"`
    RefreshToken string    `json:"refresh_token"`
    ExpiresAt    time.Time `json:"expires_at"`
}
```

### 2. GenerateJWT (Legacy)

Generates a single JWT token with 24-hour expiry.

```go
func (s *AuthService) GenerateJWT(user models.UserModel) (string, error)
```

**Usage:**
```go
authService := services.NewAuthService()
token, err := authService.GenerateJWT(user)
if err != nil {
    // Handle error
}
```

## Utility Functions

### 1. GenerateTokensForUser

Utility function to generate token pair from anywhere in the codebase.

```go
func GenerateTokensForUser(user models.UserModel) (*services.TokenPair, error)
```

**Usage:**
```go
tokenPair, err := utils.GenerateTokensForUser(user)
if err != nil {
    // Handle error
}
```

### 2. GenerateAccessTokenForUser

Utility function to generate only an access token.

```go
func GenerateAccessTokenForUser(user models.UserModel) (string, error)
```

**Usage:**
```go
accessToken, err := utils.GenerateAccessTokenForUser(user)
if err != nil {
    // Handle error
}
```

### 3. ValidateUserToken

Utility function to validate a JWT token.

```go
func ValidateUserToken(tokenString string) (*models.JWTClaims, error)
```

**Usage:**
```go
claims, err := utils.ValidateUserToken(tokenString)
if err != nil {
    // Token is invalid
}
```

### 4. GetUserFromToken

Utility function to get a user model from a JWT token.

```go
func GetUserFromToken(tokenString string) (*models.UserModel, error)
```

**Usage:**
```go
user, err := utils.GetUserFromToken(tokenString)
if err != nil {
    // Handle error
}
```

## Token Expiry Times

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- **Legacy JWT Token**: 24 hours

## Use Cases

### 1. User Login

```go
func (ac *AuthController) Login(c *gin.Context) {
    // ... authenticate user ...
    
    // Generate token pair
    tokenPair, err := ac.authService.GenerateTokenPair(*user)
    if err != nil {
        utils.InternalError(c, "Failed to generate tokens", err.Error())
        return
    }
    
    // Return tokens
    utils.Success(c, "Login successful", gin.H{
        "access_token":  tokenPair.AccessToken,
        "refresh_token": tokenPair.RefreshToken,
        "user":          user.ToUserResponse(),
        "expires_at":    tokenPair.ExpiresAt,
    })
}
```

### 2. Token Refresh

```go
func (ac *AuthController) RefreshToken(c *gin.Context) {
    // ... validate refresh token ...
    
    // Generate new token pair
    tokenPair, err := ac.authService.GenerateTokenPair(*user)
    if err != nil {
        utils.InternalError(c, "Failed to generate tokens", err.Error())
        return
    }
    
    // Return new tokens
    utils.Success(c, "Tokens refreshed successfully", gin.H{
        "access_token":  tokenPair.AccessToken,
        "refresh_token": tokenPair.RefreshToken,
        "user":          user.ToUserResponse(),
        "expires_at":    tokenPair.ExpiresAt,
    })
}
```

### 3. One-time Operations

```go
func someOneTimeOperation(user models.UserModel) {
    // Generate short-lived token for one-time operation
    accessToken, err := utils.GenerateAccessTokenForUser(user)
    if err != nil {
        // Handle error
    }
    
    // Use token for operation
    // Token will expire in 15 minutes
}
```

### 4. API Integration

```go
func generateTokensForExternalAPI(user models.UserModel) {
    // Generate tokens for external API integration
    tokenPair, err := utils.GenerateTokensForUser(user)
    if err != nil {
        // Handle error
    }
    
    // Send tokens to external API
    // External API can use access token for immediate operations
    // External API can use refresh token for long-term access
}
```

## Security Considerations

1. **Access Token**: Use for API calls, expires quickly (15 minutes)
2. **Refresh Token**: Use for getting new access tokens, longer expiry (7 days)
3. **Token Storage**: Store refresh tokens securely, never in localStorage for production
4. **Token Rotation**: Generate new refresh tokens on each refresh
5. **Token Revocation**: Implement token blacklisting for logout

## Error Handling

All functions return errors that should be handled appropriately:

```go
tokenPair, err := utils.GenerateTokensForUser(user)
if err != nil {
    switch {
    case strings.Contains(err.Error(), "jwt"):
        // JWT-related error
        log.Printf("JWT error: %v", err)
    default:
        // Other error
        log.Printf("Token generation error: %v", err)
    }
    return err
}
```

## Testing

Run the test script to verify token functionality:

```bash
./test_auth.sh
```

This will test:
1. User registration with token pair
2. User login with token pair
3. Token verification
4. Token refresh
5. Protected endpoint access

## Examples

See `examples/token_usage_examples.go` for comprehensive examples of all token generation functions.

Run the examples:

```bash
go run examples/token_usage_examples.go
```

## Migration from Legacy Tokens

If you're using the old `GenerateJWT` function, consider migrating to `GenerateTokenPair`:

**Before:**
```go
token, err := authService.GenerateJWT(user)
```

**After:**
```go
tokenPair, err := authService.GenerateTokenPair(user)
accessToken := tokenPair.AccessToken
refreshToken := tokenPair.RefreshToken
```

This provides better security with shorter-lived access tokens and refresh token capability. 