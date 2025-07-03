import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../lib/services/auth.service';
import { authConfig } from '../config/auth';
import type { User } from '../lib/services/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(authConfig.jwt.tokenKey);
        const storedUser = localStorage.getItem(authConfig.jwt.userKey);

        if (storedToken && storedUser) {
          try {
            const response = await authService.verifyToken();
            if (response.data?.valid) {
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
            } else {
              localStorage.removeItem(authConfig.jwt.tokenKey);
              localStorage.removeItem(authConfig.jwt.userKey);
            }
          } catch {
            localStorage.removeItem(authConfig.jwt.tokenKey);
            localStorage.removeItem(authConfig.jwt.userKey);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        
        localStorage.setItem(authConfig.jwt.tokenKey, newToken);
        localStorage.setItem(authConfig.jwt.userKey, JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      
      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        
        localStorage.setItem(authConfig.jwt.tokenKey, newToken);
        localStorage.setItem(authConfig.jwt.userKey, JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(authConfig.jwt.tokenKey);
    localStorage.removeItem(authConfig.jwt.userKey);
    
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(authConfig.jwt.userKey, JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 