# Authentication Flow with Access and Refresh Tokens

## Overview

The application now uses a proper JWT-based authentication system with access and refresh tokens stored in localStorage. This provides better security and user experience.

## Token Management

### Storage
- **Access Token**: Stored in `localStorage` as `access_token`
- **Refresh Token**: Stored in `localStorage` as `refresh_token`
- **State Management**: Tokens are also managed in Zustand auth store

### Token Lifecycle

1. **Login/Register**: User receives both access and refresh tokens
2. **API Requests**: Access token is automatically included in Authorization header
3. **Token Expiry**: When access token expires (401 response), system automatically attempts to refresh
4. **Refresh Success**: New tokens are stored and original request is retried
5. **Refresh Failure**: User is logged out and redirected to login page

## Implementation Details

### Auth Store (`stores/authStore.ts`)

The auth store manages:
- User data
- Access and refresh tokens
- Authentication state
- Loading states

Key methods:
- `initializeAuth()`: Checks for existing tokens on app load
- `refreshAccessToken()`: Attempts to refresh expired tokens
- `setTokens()`: Stores new tokens in localStorage and state
- `logout()`: Clears all tokens and user data

### Axios Interceptor (`lib/axios.ts`)

Automatic token handling:
- **Request Interceptor**: Adds access token to Authorization header
- **Response Interceptor**: Handles 401 errors by attempting token refresh
- **Queue Management**: Prevents multiple simultaneous refresh attempts
- **Automatic Retry**: Failed requests are retried with new tokens

### Protection Provider (`provider/ProtectionProvider.tsx`)

Route protection:
- Initializes authentication on mount
- Shows loading state during auth check
- Redirects to login if not authenticated
- Allows print mode without authentication

## Usage Examples

### Login Flow
```typescript
const { login } = useAuthStore();

try {
  await login(email, password);
  // User is automatically authenticated and redirected
} catch (error) {
  // Handle login error
}
```

### LinkedIn OAuth Flow
```typescript
// In LinkedInCallback component
const { setTokens } = useAuthStore();

const accessToken = searchParams.get('access_token');
const refreshToken = searchParams.get('refresh_token');

if (accessToken && refreshToken) {
  setTokens(accessToken, refreshToken);
  navigate('/dashboard');
}
```

### Checking Authentication Status
```typescript
const { isAuthenticated, isLoading, user } = useAuthStore();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <LoginForm />;
}

return <Dashboard user={user} />;
```

## Security Features

1. **Automatic Token Refresh**: Expired tokens are refreshed transparently
2. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
3. **Automatic Logout**: Failed refresh attempts clear all auth data
4. **Request Queuing**: Prevents race conditions during token refresh
5. **Route Protection**: Unauthenticated users are redirected to login

## Error Handling

- **Network Errors**: Handled gracefully with user feedback
- **Token Expiry**: Automatic refresh with fallback to login
- **Invalid Tokens**: Immediate logout and redirect
- **Server Errors**: Proper error messages and recovery options

## Best Practices

1. Always use the auth store methods instead of directly accessing localStorage
2. Handle loading states properly in components
3. Use the protection provider for protected routes
4. Test token refresh scenarios thoroughly
5. Monitor token expiration and refresh success rates 