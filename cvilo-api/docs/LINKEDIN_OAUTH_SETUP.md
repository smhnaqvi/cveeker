# LinkedIn OAuth Setup Guide

This guide explains how to set up LinkedIn OAuth authentication for the Cvilo API.

## Prerequisites

1. A LinkedIn Developer Account
2. A LinkedIn App created in the LinkedIn Developer Console

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
   - `http://localhost:8081/api/v1/linkedin/callback` (for development)
   - `https://yourdomain.com/api/v1/linkedin/callback` (for production)
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
LINKEDIN_REDIRECT_URL=http://localhost:8081/api/v1/linkedin/callback

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

## Step 6: Test the Integration

1. Start the API server:
   ```bash
   go run main.go
   ```

2. Test the OAuth flow:
   ```bash
   # Get OAuth URL
   curl "http://localhost:8081/api/v1/linkedin/auth-url?user_id=1"
   
   # Handle callback (this will be called by LinkedIn after user authorization)
   curl -X POST "http://localhost:8081/api/v1/linkedin/callback" \
     -H "Content-Type: application/json" \
     -d '{"code":"authorization_code_from_linkedin"}'
   ```

## API Endpoints

### 1. Get OAuth URL
```
GET /api/v1/linkedin/auth-url?user_id={user_id}&state={state}
```
Returns the LinkedIn OAuth authorization URL.

### 2. Handle OAuth Callback
```
POST /api/v1/linkedin/callback
Content-Type: application/json

{
  "code": "authorization_code_from_linkedin",
  "state": "optional_state_parameter"
}
```
Processes the OAuth callback and creates/updates user profile.

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
DELETE /api/v1/linkedin/disconnect/{user_id}
```
Disconnects LinkedIn authentication for a user.

## Data Flow

1. **User initiates OAuth**: Frontend calls `/auth-url` to get LinkedIn OAuth URL
2. **User authorizes**: User is redirected to LinkedIn and authorizes the app
3. **LinkedIn redirects**: LinkedIn redirects back to `/callback` with authorization code
4. **API processes callback**: Backend exchanges code for access token and fetches profile data
5. **User created/updated**: User is created or updated with LinkedIn profile data
6. **Resume created**: A complete resume is automatically created from LinkedIn profile data

## Database Schema

### LinkedInAuthModel
- `user_id`: Reference to the user
- `linkedin_id`: LinkedIn user ID
- `access_token`: OAuth access token
- `refresh_token`: OAuth refresh token
- `token_expiry`: Token expiration time
- `profile_url`: LinkedIn profile URL
- `is_active`: Whether the connection is active

### ResumeModel (Created from LinkedIn Data)
- `user_id`: Reference to the user
- `title`: Resume title (default: "LinkedIn Profile Resume")
- `full_name`: User's full name from LinkedIn
- `email`: Email address from LinkedIn
- `phone`: Phone number from LinkedIn
- `address`: Location from LinkedIn
- `website`: Website URL from LinkedIn
- `linkedin`: LinkedIn profile URL
- `summary`: Professional summary from LinkedIn
- `experience`: JSON array of work experience converted from LinkedIn positions
- `education`: JSON array of education converted from LinkedIn education
- `skills`: JSON array of skills converted from LinkedIn skills
- `certifications`: JSON array of certifications converted from LinkedIn certifications
- `languages`: JSON array of languages converted from LinkedIn languages
- `projects`: JSON array of projects converted from LinkedIn projects
- `awards`: JSON array of awards converted from LinkedIn honors
- `template`: Resume template (default: "modern")
- `theme`: Resume theme (default: "blue")

## Security Considerations

1. **Environment Variables**: Never commit OAuth credentials to version control
2. **HTTPS**: Use HTTPS in production for all OAuth endpoints
3. **Token Storage**: Access tokens are encrypted and stored securely
4. **Token Refresh**: The system automatically refreshes expired tokens
5. **User Consent**: Users must explicitly authorize the app to access their data

## Troubleshooting

### Common Issues

1. **Invalid redirect URI**: Ensure the redirect URL in your LinkedIn app matches exactly
2. **Missing permissions**: Make sure you've requested the necessary API permissions
3. **Token expiration**: The system handles token refresh automatically
4. **Rate limiting**: LinkedIn has rate limits on API calls

### Error Responses

The API returns standardized error responses:

```json
{
  "status": "error",
  "code": 400,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Support

For issues with LinkedIn OAuth integration:
1. Check the LinkedIn Developer Console for app status
2. Verify environment variables are set correctly
3. Check API logs for detailed error messages
4. Ensure your LinkedIn app is approved for the required permissions 