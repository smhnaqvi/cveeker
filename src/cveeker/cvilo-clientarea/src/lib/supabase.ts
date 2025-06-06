import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import { authConfig } from '../config/auth'

// Create Supabase client
export const supabase = createClient(
  authConfig.supabase.url,
  authConfig.supabase.anonKey
)

// Authentication helper functions
export const auth = {
  // Email/Password authentication
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, session: data.session, error }
  },

  signUpWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data.user, session: data.session, error }
  },

  // OAuth authentication
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${authConfig.redirectUrls.signIn}`,
      },
    })
    return { data, error }
  },

  signInWithGitHub: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}${authConfig.redirectUrls.signIn}`,
      },
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Get current session
  getCurrentSession: () => {
    return supabase.auth.getSession()
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

export default supabase 