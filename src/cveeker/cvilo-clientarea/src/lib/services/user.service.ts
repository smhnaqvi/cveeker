import { BaseService } from './base';
import type { 
  ApiResponse, 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  PaginatedResponse,
  QueryParams 
} from './types';

export class UserService extends BaseService {
  constructor() {
    super('users');
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<User>('/profile');
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.put<User>('/profile', data);
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.get<User>(`/${id}`);
  }

  /**
   * Get all users (admin only)
   */
  async getUsers(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.get<PaginatedResponse<User>>('', params);
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.post<User>('', userData);
  }

  /**
   * Update user by ID (admin only)
   */
  async updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.put<User>(`/${id}`, data);
  }

  /**
   * Delete user by ID (admin only)
   */
  async deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${id}`);
  }

  /**
   * Search users
   */
  async searchUsers(query: string, params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.get<PaginatedResponse<User>>('/search', { ...params, search: query });
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStats(): Promise<ApiResponse<{ total: number; active: number; inactive: number }>> {
    return this.get<{ total: number; active: number; inactive: number }>('/stats');
  }

  /**
   * Activate/deactivate user (admin only)
   */
  async toggleUserStatus(id: number, active: boolean): Promise<ApiResponse<User>> {
    return this.patch<User>(`/${id}/status`, { active });
  }
}

// Export singleton instance
export const userService = new UserService(); 