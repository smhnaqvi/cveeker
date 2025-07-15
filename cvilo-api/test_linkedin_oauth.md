# LinkedIn OAuth Test Guide

## Updated OAuth Flow with Dynamic Redirect URLs

The LinkedIn OAuth implementation now supports dynamic redirect URLs from query parameters and request body.

### 1. Get Authorization URL

**Request:**
```bash
GET /api/v1/linkedin/auth-url?user_id=1&state=test123&redirect_uri=http://localhost:3000/auth/linkedin/callback
```

**Response:**
```json
{
  "success": true,
  "data": {
    "auth_url": "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...&redirect_uri=http%3A//localhost%3A3000/auth/linkedin/callback&state=test123&scope=openid%20profile%20email",
    "state": "test123",
    "user_id": "1"
  },
  "message": "LinkedIn authorization URL generated successfully"
}
```

### 2. Handle OAuth Callback

**Request:**
```bash
POST /api/v1/linkedin/callback
Content-Type: application/json

{
  "code": "authorization_code_from_linkedin",
  "state": "test123",
  "redirect_uri": "http://localhost:3000/auth/linkedin/callback"
}
```

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
      "summary": "Experienced software developer...",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  },
  "message": "LinkedIn authentication successful"
}
```

### 3. Test Scenarios

#### Scenario 1: Default Redirect URL
If no `redirect_uri` is provided, the system uses the default from environment variables.

**Request:**
```bash
GET /api/v1/linkedin/auth-url?user_id=1
```

#### Scenario 2: Custom Redirect URL
Provide a custom redirect URL for different frontend applications.

**Request:**
```bash
GET /api/v1/linkedin/auth-url?user_id=1&redirect_uri=http://localhost:3000/auth/linkedin/callback
```

#### Scenario 3: Frontend Integration
Frontend can now pass the same redirect URL in both the auth URL request and callback.

**Frontend Flow:**
1. Get auth URL with redirect_uri parameter
2. Redirect user to LinkedIn
3. LinkedIn redirects back to the specified redirect_uri
4. Frontend extracts the authorization code
5. Send code + redirect_uri to API callback endpoint

### 4. Logging

The enhanced logging will show:
```
GetAuthURL: Received user_id=1, state=test123, redirect_uri=http://localhost:3000/auth/linkedin/callback
GetAuthURL: Using custom redirect URL: http://localhost:3000/auth/linkedin/callback
GetAuthURL: Generating auth URL with state=test123, redirect_url=http://localhost:3000/auth/linkedin/callback
GetAuthURL: Generated auth URL: https://www.linkedin.com/oauth/v2/authorization?...

HandleCallback: Received authorization code, length=123, state=test123, redirect_uri=http://localhost:3000/auth/linkedin/callback
ExchangeCodeForToken: Using custom redirect URL: http://localhost:3000/auth/linkedin/callback
ExchangeCodeForToken: Attempting to exchange code, length=123, redirect_url=http://localhost:3000/auth/linkedin/callback
```

### 5. Error Handling

The system will handle various error scenarios:

- **Missing redirect_uri**: Uses default from environment
- **Invalid redirect_uri**: LinkedIn will reject the OAuth request
- **Mismatched redirect_uri**: Detailed error logs will show the mismatch

### 6. Testing Commands

```bash
# Test with custom redirect URL
curl "http://localhost:8081/api/v1/linkedin/auth-url?user_id=1&redirect_uri=http://localhost:3000/auth/linkedin/callback"

# Test callback with redirect_uri
curl -X POST "http://localhost:8081/api/v1/linkedin/callback" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "your_authorization_code",
    "state": "test123",
    "redirect_uri": "http://localhost:3000/auth/linkedin/callback"
  }'
```

### 7. Benefits

1. **Flexibility**: Support multiple frontend applications with different redirect URLs
2. **Debugging**: Enhanced logging shows exactly which redirect URL is being used
3. **Consistency**: Same redirect URL used in both authorization and token exchange
4. **Backward Compatibility**: Falls back to environment variable if no redirect_uri provided 