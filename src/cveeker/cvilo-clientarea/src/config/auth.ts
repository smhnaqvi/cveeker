// Authentication configuration
export const authConfig = {
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8081',
    authEndpoint: '/api/v1/auth',
  },
  
  // JWT configuration
  jwt: {
    tokenKey: 'auth_token',
    userKey: 'user',
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
    linkedin: {
      enabled: true,
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