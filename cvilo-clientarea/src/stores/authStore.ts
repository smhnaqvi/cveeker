import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../lib/services/auth.service';
import type { User } from '../lib/services/types';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  refreshAccessToken: () => Promise<boolean>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setTokens: (accessToken: string, refreshToken: string) => {
        // Update state - Zustand persist will handle localStorage
        set({ 
          accessToken, 
          refreshToken,
          isAuthenticated: true 
        });
        
        console.log('setTokens', accessToken, refreshToken);
      },

      refreshAccessToken: async (): Promise<boolean> => {
        const { refreshToken } = get();
        
        console.log('refreshAccessToken called, refreshToken exists:', !!refreshToken);
        
        if (!refreshToken) {
          console.log('No refresh token available');
          return false;
        }

        try {
          console.log('Calling authService.refreshToken with refresh token');
          const response = await authService.refreshToken(refreshToken);
          
          console.log('Refresh token response:', response);
          
          if (response.data) {
            const { access_token, refresh_token } = response.data;
            
            console.log('Updating tokens in store');
            // Update state - Zustand persist will handle localStorage
            set({ 
              accessToken: access_token, 
              refreshToken: refresh_token,
              isAuthenticated: true 
            });
            
            return true;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: error instanceof Error && 'response' in error ? (error as { response?: { status?: number; data?: unknown } }).response : null,
            status: error instanceof Error && 'response' in error ? (error as { response?: { status?: number; data?: unknown } }).response?.status : null,
            data: error instanceof Error && 'response' in error ? (error as { response?: { status?: number; data?: unknown } }).response?.data : null,
          });
          // Clear invalid tokens
          get().logout();
          return false;
        }
        
        return false;
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        
        console.log('initializeAuth');
        
        try {
          // Get tokens from current state (Zustand persist handles localStorage)
          const { accessToken, refreshToken } = get();
          
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);

          if (!accessToken || !refreshToken) {
            console.log('no tokens found');
            // No tokens found, user needs to login
            set({ 
              user: null, 
              accessToken: null, 
              refreshToken: null, 
              isAuthenticated: false,
              isLoading: false 
            });
            return;
          }

          // Verify token is still valid
          try {
            const response = await authService.verifyToken();

            console.log('verifyToken', response);
            
            if (response.data?.valid) {
              // Token is valid, get user data
              try {
                const userResponse = await authService.getCurrentUser();
                if (userResponse.data) {
                  set({ 
                    user: userResponse.data, 
                    isAuthenticated: true,
                    isLoading: false 
                  });
                  return;
                }
              } catch (userError) {
                console.error('Failed to get user data:', userError);
              }
            }
          } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
          }

          // Token is invalid, try to refresh
          const refreshSuccess = await get().refreshAccessToken();
          
          if (refreshSuccess) {
            // Refresh successful, get user data
            try {
              const userResponse = await authService.getCurrentUser();
              if (userResponse.data) {
                set({ 
                  user: userResponse.data, 
                  isAuthenticated: true,
                  isLoading: false 
                });
                return;
              }
            } catch (userError) {
              console.error('Failed to get user data after refresh:', userError);
            }
          }

          // All attempts failed, clear state
          set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authService.login({ email, password });
          
          if (response.data) {
            const { access_token, refresh_token, user: userData } = response.data;
            
            // Update state - Zustand persist will handle localStorage
            set({
              user: userData,
              accessToken: access_token,
              refreshToken: refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authService.register({ name, email, password });
          
          if (response.data) {
            const { access_token, refresh_token, user: userData } = response.data;
            
            // Update state - Zustand persist will handle localStorage
            set({
              user: userData,
              accessToken: access_token,
              refreshToken: refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Zustand persist will handle localStorage cleanup
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: User) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  updateUser: state.updateUser,
  initializeAuth: state.initializeAuth,
  refreshAccessToken: state.refreshAccessToken,
  setTokens: state.setTokens,
})); 