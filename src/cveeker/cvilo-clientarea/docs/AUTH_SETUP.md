# CVilo Authentication Setup Guide

## Prerequisites

1. **Supabase Project**: Create a free account at [supabase.com](https://supabase.com)
2. **GitHub OAuth App**: Register at GitHub Developer Settings
3. **Google OAuth App**: Register at Google Cloud Console

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Providers (Optional - for development)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## Supabase Setup

1. **Create a new Supabase project**
2. **Get your project URL and anon key** from Settings > API
3. **Enable authentication providers**:
   - Go to Authentication > Providers
   - Enable Google and GitHub providers
   - Add your OAuth app credentials

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: `CVilo`
   - Homepage URL: `http://localhost:5173` (or your domain)
   - Authorization callback URL: `https://your-supabase-url.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. Add them to your Supabase project (Authentication > Providers > GitHub)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Configure the OAuth consent screen
6. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.com` (production)
7. Add authorized redirect URIs:
   - `https://your-supabase-url.supabase.co/auth/v1/callback`
8. Copy the Client ID and Client Secret
9. Add them to your Supabase project (Authentication > Providers > Google)

## Database Schema

Supabase automatically creates the necessary authentication tables. You can extend the user profile by creating additional tables:

```sql
-- Optional: Create a profiles table for additional user data
create table profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

## Testing the Login

1. Start the development server: `yarn dev`
2. Navigate to `http://localhost:5173/auth/login`
3. Test all three login methods:
   - Email/Password (create an account first)
   - Google OAuth
   - GitHub OAuth

## Production Deployment

Before deploying to production:

1. Update all URLs to use your production domain
2. Update OAuth app settings with production URLs
3. Set environment variables in your hosting platform
4. Test all authentication flows thoroughly

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**: Check email/password, ensure user exists
2. **OAuth redirect errors**: Verify callback URLs match exactly
3. **CORS errors**: Check Supabase URL and ensure it's properly configured
4. **Environment variables not loading**: Restart development server after adding .env

### Debug Tips:

- Check browser developer tools for network errors
- Check Supabase dashboard for authentication logs
- Ensure all environment variables are properly set
- Verify OAuth app configurations match Supabase settings 