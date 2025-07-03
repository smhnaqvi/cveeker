# LinkedIn OAuth Setup Guide (Frontend Integration)

This guide explains how to set up LinkedIn OAuth authentication for the Cvilo API with frontend callback handling.

## Prerequisites

1. A LinkedIn Developer Account
2. A LinkedIn App created in the LinkedIn Developer Console
3. Frontend application running on a known domain/port

## Step 1: Create a LinkedIn App

1. Go to [LinkedIn Developer Console](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in the required information:
   - App name: `Cvilo Resume Builder`
   - LinkedIn Page: Your company's LinkedIn page
   - App Logo: Upload your app logo
4. Submit the form

## Step 2: Configure OAuth Settings

1. In your LinkedIn app dashboard, go to "Auth" tab
2. Add the following OAuth 2.0 redirect URLs:
   - `http://localhost:3000/auth/linkedin/callback` (for frontend development)
   - `https://yourdomain.com/auth/linkedin/callback` (for production)
3. Save the changes

## Step 3: Get OAuth Credentials

1. In your LinkedIn app dashboard, go to "Auth" tab
2. Copy the following values:
   - **Client ID**: This is your LinkedIn app's client ID
   - **Client Secret**: This is your LinkedIn app's client secret

## Step 4: Configure Environment Variables

Create a `.env` file in the `cvilo-api` directory with the following variables:

```env
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_REDIRECT_URL=http://localhost:3000/auth/linkedin/callback

# Server Configuration
PORT=8081
ENV=development
```

## Step 5: Request API Permissions

1. In your LinkedIn app dashboard, go to "Products" tab
2. Request access to the following APIs:
   - **Sign In with LinkedIn**: For basic authentication
   - **Marketing Developer Platform**: For profile data access
   - **Share on LinkedIn**: For posting capabilities (optional)

## Step 6: Frontend Configuration

Ensure your frontend is configured with the correct API base URL:

```env
# Frontend .env file
VITE_API_URL=http://localhost:8081
```

## Step 7: Test the Integration

1. Start the backend API server:
   ```bash
   cd cvilo-api
   go run main.go
   ```

2. Start the frontend development server:
   ```bash
   cd cvilo-clientarea
   npm run dev
   ```

3. Test the OAuth flow:
   - Navigate to `http://localhost:3000/auth/login`
   - Click "Continue with LinkedIn"
   - Complete the OAuth flow
   - Verify redirect to dashboard

## OAuth Flow

### 1. User Initiates Login
1. User clicks "Continue with LinkedIn" on frontend
2. Frontend generates random state parameter
3. Frontend calls backend `/api/v1/linkedin/auth-url` with state
4. Backend returns LinkedIn OAuth URL
5. Frontend stores state in localStorage
6. Frontend redirects user to LinkedIn

### 2. User Authorizes on LinkedIn
1. User sees LinkedIn authorization page
2. User grants permissions to the app
3. LinkedIn redirects to frontend callback URL with code and state

### 3. Frontend Processes Callback
1. Frontend extracts code and state from URL
2. Frontend verifies state parameter matches stored value
3. Frontend calls backend `/api/v1/linkedin/callback` with code
4. Backend exchanges code for access token
5. Backend fetches user profile from LinkedIn
6. Backend creates/updates user and resume
7. Backend returns user and resume data
8. Frontend stores user data and redirects to dashboard

## API Endpoints

### 1. Get OAuth URL
```
GET /api/v1/linkedin/auth-url?state={state}
```
Returns the LinkedIn OAuth authorization URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "auth_url": "https://linkedin.com/oauth/authorize?client_id=...",
    "state": "random_state_string"
  }
}
```

### 2. Handle OAuth Callback
```
POST /api/v1/linkedin/callback
Content-Type: application/json

{
  "code": "authorization_code_from_linkedin",
  "state": "state_parameter"
}
```
Processes the OAuth callback and creates/updates user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "resume": {
      "id": 1,
      "title": "LinkedIn Profile Resume",
      "full_name": "John Doe",
      "summary": "Professional summary...",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  }
}
```

### 3. Get LinkedIn Profile
```
GET /api/v1/linkedin/profile/{user_id}
```
Retrieves the LinkedIn profile data for a user.

### 4. Sync LinkedIn Profile
```
POST /api/v1/linkedin/sync/{user_id}
```
Syncs the latest LinkedIn profile data for a user.

### 5. Disconnect LinkedIn
```
POST /api/v1/linkedin/disconnect/{user_id}
```
Disconnects LinkedIn authentication for a user.

## Security Considerations

1. **State Parameter**: Always generate and verify state parameter to prevent CSRF attacks
2. **HTTPS**: Use HTTPS in production for all OAuth endpoints
3. **Token Storage**: Access tokens are encrypted and stored securely in backend
4. **Token Refresh**: The system automatically refreshes expired tokens
5. **User Consent**: Users must explicitly authorize the app to access their data

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure LinkedIn app redirect URI matches frontend callback URL exactly
   - Check environment variables are set correctly

2. **CORS Issues**
   - Ensure backend allows frontend origin
   - Check CORS configuration in backend

3. **State Parameter Issues**
   - Verify state is properly generated and stored
   - Check state verification logic

4. **Token Issues**
   - Check backend token handling
   - Verify LinkedIn app permissions

### Error Responses

The API returns standardized error responses:

```json
{
  "success": false,
  "code": 400,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Development vs Production

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8081`
- LinkedIn Redirect: `http://localhost:3000/auth/linkedin/callback`

### Production
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`
- LinkedIn Redirect: `https://yourdomain.com/auth/linkedin/callback`

## Support

For issues with LinkedIn OAuth integration:
1. Check browser console for frontend errors
2. Verify backend server is running
3. Check LinkedIn app configuration
4. Review environment variables
5. Ensure CORS is properly configured 