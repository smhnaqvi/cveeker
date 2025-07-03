# JWT Authentication Implementation

This document describes the JWT authentication system implemented for the Cvilo API.

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication and authorization. It includes user registration, login, token verification, and protected routes.

## Backend Implementation

### Dependencies Added

- `github.com/golang-jwt/jwt/v5` - JWT token handling
- `golang.org/x/crypto/bcrypt` - Password hashing

### Files Created/Modified

#### 1. Models (`models/auth.go`)
- `LoginRequest` - Login request structure
- `RegisterRequest` - Registration request structure
- `AuthResponse` - Authentication response structure
- `JWTClaims` - JWT token claims structure
- `PasswordChangeRequest` - Password change request structure

#### 2. User Model (`models/user.go`)
- Added `Password` field to `UserModel`
- Added `ToUserResponse()` method
- Updated `UserCreateRequest` to include password

#### 3. Authentication Service (`services/auth_service.go`)
- `HashPassword()` - Hash passwords using bcrypt
- `CheckPassword()` - Verify password against hash
- `GenerateJWT()` - Generate JWT tokens
- `ValidateJWT()` - Validate JWT tokens
- `AuthenticateUser()` - Authenticate user credentials
- `RegisterUser()` - Register new users
- `ChangePassword()` - Change user password

#### 4. Authentication Controller (`controllers/auth_controller.go`)
- `Login()` - Handle user login
- `Register()` - Handle user registration
- `Me()` - Get current user profile
- `ChangePassword()` - Change user password
- `VerifyToken()` - Verify JWT token

#### 5. Authentication Middleware (`middleware/auth.go`)
- `AuthMiddleware()` - Protect routes requiring authentication
- `OptionalAuthMiddleware()` - Optional authentication for routes

#### 6. Main Application (`main.go`)
- Added auth routes
- Added protected routes with middleware

## API Endpoints

### Public Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/verify` - Verify JWT token

### Protected Endpoints (require authentication)
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/change-password` - Change user password

## Frontend Implementation

### Files Created/Modified

#### 1. Authentication Service (`src/lib/services/auth.service.ts`)
- Updated to use `/api/v1/auth` endpoint
- Includes all authentication methods

#### 2. Authentication Configuration (`src/config/auth.ts`)
- Updated to use JWT instead of Supabase
- Added API configuration

#### 3. Authentication Context (`src/context/AuthContext.tsx`)
- Manages authentication state
- Provides login, register, logout functions
- Handles token storage and validation

#### 4. Login Page (`src/pages/auth/login.tsx`)
- Updated to use auth service
- Added navigation to dashboard
- Added link to registration page

#### 5. Registration Page (`src/pages/auth/register.tsx`)
- New registration form
- Uses auth service for registration
- Includes social login options

#### 6. Router (`src/router/router.tsx`)
- Added registration route

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8081
HOST=localhost
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:8081
```

## Usage

### Backend Setup
1. Run the setup script: `./setup_auth_env.sh`
2. Start the server: `go run main.go`

### Frontend Setup
1. Install dependencies: `yarn install`
2. Start the development server: `yarn dev`

### Testing
1. Run the test script: `./test_auth.sh`
2. This will test registration, login, and protected endpoints

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiration**: Tokens expire after 24 hours
4. **Protected Routes**: Middleware protects sensitive endpoints
5. **Input Validation**: All inputs are validated using struct tags

## Token Structure

JWT tokens contain the following claims:
- `user_id`: User's unique identifier
- `email`: User's email address
- `role`: User's role (default: "user")
- Standard JWT claims (exp, iat, nbf, iss, sub)

## Error Handling

The system provides comprehensive error handling:
- Invalid credentials
- Token validation errors
- User not found
- Account deactivation
- Validation errors

## Future Enhancements

1. **Refresh Tokens**: Implement refresh token mechanism
2. **Password Reset**: Add forgot password functionality
3. **Email Verification**: Add email verification for new accounts
4. **Role-Based Access**: Implement role-based authorization
5. **Rate Limiting**: Add rate limiting for auth endpoints
6. **Audit Logging**: Log authentication events

## Testing

Use the provided test script to verify the implementation:
```bash
./test_auth.sh
```

This will test:
1. User registration
2. User login
3. Protected endpoint access
4. Token verification 