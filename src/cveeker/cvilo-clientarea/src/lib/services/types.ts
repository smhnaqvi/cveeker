// Common API response types
export interface ApiResponse<T = unknown> {
  code: number;
  data?: T;
  message?: string;
  path?: string;
  status?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User related types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  token: string;
}

// LinkedIn authentication types
export interface LinkedInAuthRequest {
  code: string;
  state?: string;
}

export interface LinkedInAuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  resume: {
    id: number;
    title: string;
    full_name: string;
    summary: string;
    linkedin: string;
  };
}

export interface LinkedInAuthURLResponse {
  auth_url: string;
  state: string;
  user_id?: string;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  [key: string]: unknown;
}

// Combined query parameters
export type QueryParams = PaginationParams & SortParams & FilterParams; 