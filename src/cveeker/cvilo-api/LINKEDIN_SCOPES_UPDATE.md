# LinkedIn OAuth Scopes Update

## Updated Scopes Configuration

The LinkedIn OAuth implementation has been updated to work with the available scopes:

### Available Scopes
- `openid` - Use your name and photo
- `profile` - Use your name and photo  
- `w_member_social` - Create, modify, and delete posts, comments, and reactions on your behalf
- `email` - Use the primary email address associated with your LinkedIn account

### What Changed

1. **Removed `/v2/me` endpoint access**: This endpoint requires additional permissions not available in your LinkedIn app
2. **Using only `/v2/userinfo` endpoint**: This endpoint is available with the `openid` scope
3. **Limited profile data**: Only basic information (name, email, LinkedIn ID) is available

### Available Profile Data

With the current scopes, we can access:
- **Full Name**: From the `name` field
- **Email**: From the `email` field  
- **LinkedIn ID**: From the `sub` field (used to construct LinkedIn profile URL)
- **Given Name**: From the `given_name` field
- **Family Name**: From the `family_name` field
- **Profile Picture**: From the `picture` field (not currently used)

### What's Not Available

Due to scope limitations, we cannot access:
- Professional headline
- Summary/bio
- Location
- Industry
- Work experience
- Education
- Skills
- Certifications

### Updated OAuth Flow

1. **Authorization**: Uses the updated scopes
2. **Profile Fetching**: Only calls `/v2/userinfo` endpoint
3. **Resume Creation**: Creates a basic resume with available information

### Example Response

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
      "summary": "Professional profile for John Doe",
      "linkedin": "https://linkedin.com/in/johndoe123"
    }
  },
  "message": "LinkedIn authentication successful"
}
```

### Testing

Test the updated flow:

```bash
# Get auth URL with updated scopes
curl "http://localhost:8081/api/v1/linkedin/auth-url?user_id=1"

# The auth URL will now include: scope=openid%20profile%20email%20w_member_social
```

### Logging

The updated implementation includes detailed logging:

```
GetUserProfile: Fetching user profile from LinkedIn UserInfo endpoint
GetUserProfile: Successfully fetched profile for user: John Doe (sub: johndoe123)
GetUserProfile: Created resume with basic information - Name: John Doe, Email: john@example.com
```

### Future Enhancements

To get more profile data, you would need to:
1. Request additional scopes from LinkedIn (requires app review)
2. Update the implementation to use additional endpoints
3. Handle the additional data in the resume creation process

### Troubleshooting

If you still get permission errors:
1. Ensure your LinkedIn app has the correct scopes configured
2. Check that the user has granted the required permissions
3. Verify the access token is valid and not expired
4. Check the logs for detailed error messages 