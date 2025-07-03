import { BaseService } from './base';
import type { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenResponse,
  User 
} from './types';

export class AuthService extends BaseService {
  constructor() {
    super('auth');
  }

  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/login', credentials);
  }

  /**
   * User registration
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/register', userData);
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/logout');
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    return this.post<RefreshTokenResponse>('/refresh');
  }

  /**
   * Verify current token
   */
  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return this.get<{ valid: boolean }>('/verify');
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/forgot-password', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/reset-password', { token, newPassword });
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/change-password', { currentPassword, newPassword });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/me');
  }
}

// Export singleton instance
export const authService = new AuthService(); 