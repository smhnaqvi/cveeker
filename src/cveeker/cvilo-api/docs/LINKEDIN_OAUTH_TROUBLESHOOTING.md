# LinkedIn OAuth Troubleshooting Guide

## Common Error: "appid/redirect uri/code verifier does not match authorization code"

This error occurs when there's a mismatch between the OAuth configuration used during authorization and token exchange.

### Root Causes

1. **Redirect URL Mismatch** (Most Common)
   - The redirect URL in your LinkedIn app doesn't match the one in your environment variables
   - The redirect URL used during authorization doesn't match the one used during token exchange

2. **Authorization Code Expired**
   - LinkedIn authorization codes expire within 10 minutes
   - If you wait too long between authorization and token exchange, the code becomes invalid

3. **Code Verifier Mismatch** (If using PKCE)
   - The code verifier used during authorization doesn't match the one used during token exchange

4. **Client ID/Secret Mismatch**
   - The client ID or secret in your environment variables doesn't match your LinkedIn app

### Solutions

#### 1. Check Environment Variables

Run the setup script to configure your environment variables correctly:

```bash
cd cvilo-api
./setup_env.sh
```

Or manually set the environment variables:

```bash
export LINKEDIN_CLIENT_ID="your_client_id"
export LINKEDIN_CLIENT_SECRET="your_client_secret"
export LINKEDIN_REDIRECT_URL="http://localhost:8081/api/v1/linkedin/callback"
```

#### 2. Verify LinkedIn App Configuration

1. Go to your LinkedIn Developer Console
2. Navigate to your app's OAuth 2.0 settings
3. Ensure the redirect URL exactly matches your environment variable:
   - Should be: `http://localhost:8081/api/v1/linkedin/callback`
   - Note: No trailing slash, exact case matching

#### 3. Check the Logs

The enhanced logging will show you:
- What redirect URL is being used
- What client ID is being used (masked for security)
- Detailed error messages during token exchange

Look for these log messages:
```
NewLinkedInService: Initializing with client_id=****, redirect_url=http://localhost:8081/api/v1/linkedin/callback
GetAuthURL: Generating auth URL with state=default_state, redirect_url=http://localhost:8081/api/v1/linkedin/callback
ExchangeCodeForToken: Attempting to exchange code, length=123, redirect_url=http://localhost:8081/api/v1/linkedin/callback
```

#### 4. Common Configuration Issues

**Wrong Port Number**
- API runs on port 8081, not 3000
- Make sure redirect URL is: `http://localhost:8081/api/v1/linkedin/callback`

**Trailing Slash**
- LinkedIn is strict about exact URL matching
- Use: `http://localhost:8081/api/v1/linkedin/callback`
- Not: `http://localhost:8081/api/v1/linkedin/callback/`

**Protocol Mismatch**
- Use `http://` for localhost development
- Use `https://` for production

**Case Sensitivity**
- URLs are case-sensitive
- Ensure exact matching between LinkedIn app and environment variables

#### 5. Testing the Configuration

1. **Test Environment Variables**
   ```bash
   cd cvilo-api
   go run main.go
   ```
   Look for the initialization logs to confirm the redirect URL.

2. **Test OAuth Flow**
   - Get auth URL: `GET /api/v1/linkedin/auth-url`
   - Complete authorization on LinkedIn
   - Exchange code: `POST /api/v1/linkedin/callback`
   - Check logs for any errors

#### 6. Quick Fix Checklist

- [ ] Environment variables are set correctly
- [ ] LinkedIn app redirect URL matches exactly
- [ ] No trailing slashes in URLs
- [ ] Using correct port (8081 for API)
- [ ] Authorization code is fresh (within 10 minutes)
- [ ] Client ID and secret are correct
- [ ] API server is restarted after environment changes

#### 7. Debugging Steps

1. **Check Current Configuration**
   ```bash
   cd cvilo-api
   cat .env | grep LINKEDIN
   ```

2. **Verify LinkedIn App Settings**
   - Client ID matches environment variable
   - Redirect URL matches exactly
   - App is in development mode (for localhost)

3. **Test with Curl**
   ```bash
   # Get auth URL
   curl "http://localhost:8081/api/v1/linkedin/auth-url"
   
   # Exchange code (replace with actual code)
   curl -X POST "http://localhost:8081/api/v1/linkedin/callback" \
     -H "Content-Type: application/json" \
     -d '{"code":"your_authorization_code","state":"default_state"}'
   ```

#### 8. Production Considerations

For production deployment:
- Use HTTPS URLs
- Update LinkedIn app redirect URLs
- Set environment variables securely
- Consider using PKCE for enhanced security

### Still Having Issues?

If you're still experiencing problems:

1. Check the detailed logs for specific error messages
2. Verify your LinkedIn app has the correct permissions
3. Ensure your LinkedIn app is approved for the scopes you're requesting
4. Try creating a new LinkedIn app for testing
5. Check if LinkedIn has any rate limiting or temporary issues

### Log Analysis

The enhanced logging will help you identify:
- Configuration mismatches
- Timing issues
- Network problems
- LinkedIn API errors

Look for patterns in the logs to identify the root cause of the issue. 