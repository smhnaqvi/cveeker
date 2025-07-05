import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081', // Default to your Go API port
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from auth store state
    const { useAuthStore } = await import('../stores/authStore');
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    
    const originalRequest = error.config;
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          if (!originalRequest._retry) {
            if (isRefreshing) {
              // If already refreshing, queue this request
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              }).then(() => {
                return api(originalRequest);
              }).catch((err) => {
                return Promise.reject(err);
              });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
              console.log('Attempting to refresh token...');
              // Try to refresh the token using auth store
              const { useAuthStore } = await import('../stores/authStore');
              const refreshSuccess = await useAuthStore.getState().refreshAccessToken();
              
              if (refreshSuccess) {
                console.log('Token refresh successful');
                // Get the new access token
                const newAccessToken = useAuthStore.getState().accessToken;
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                
                return api(originalRequest);
              } else {
                console.log('Token refresh returned false');
                throw new Error('Token refresh failed');
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              
              // Clear tokens and redirect to login
              const { useAuthStore } = await import('../stores/authStore');
              useAuthStore.getState().logout();
              
              processQueue(refreshError, null);
              
              // Redirect to login page
              window.location.href = '/auth/login';
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error(`HTTP ${status}:`, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // GET request

  serverPath: (path: string) => `${api.defaults.baseURL}${path}`,

  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
  
  // POST request
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
  
  // PUT request
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
  
  // DELETE request
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
  
  // PATCH request
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(response => response.data),
};

// Export the axios instance for custom usage
export default api;

// Type definitions for common API responses
export interface ApiResponse<T = unknown> {
  status: string;
  code: number;
  data?: T;
  message?: string;
  path?: string;
  timestamp?: string;
  request_id?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 