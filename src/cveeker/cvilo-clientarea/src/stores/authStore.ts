import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../lib/services/auth.service';
import type { User } from '../lib/services/types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      initializeAuth: async () => {
        const { token, user } = get();
        
        if (token && user) {
          try {
            const response = await authService.verifyToken();
            if (response.data?.valid) {
              set({ isAuthenticated: true });
            } else {
              // Token is invalid, clear state
              set({ 
                user: null, 
                token: null, 
                isAuthenticated: false 
              });
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Clear invalid state
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false 
            });
          }
        }
        
        set({ isLoading: false });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authService.login({ email, password });
          
          if (response.data) {
            const { token, user: userData } = response.data;
            
            set({
              user: userData,
              token: token,
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
            const { token, user: userData } = response.data;
            
            set({
              user: userData,
              token: token,
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
        set({
          user: null,
          token: null,
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
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  updateUser: state.updateUser,
  initializeAuth: state.initializeAuth,
})); 