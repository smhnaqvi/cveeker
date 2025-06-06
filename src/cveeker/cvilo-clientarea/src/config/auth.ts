// Authentication configuration
export const authConfig = {
  // Supabase configuration (you'll need to set these up)
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  },
  
  // OAuth providers
  providers: {
    google: {
      enabled: true,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    },
    github: {
      enabled: true,
      clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
    },
  },
  
  // Redirect URLs
  redirectUrls: {
    signIn: '/dashboard',
    signUp: '/dashboard',
    signOut: '/auth/login',
  },
}

export default authConfig 