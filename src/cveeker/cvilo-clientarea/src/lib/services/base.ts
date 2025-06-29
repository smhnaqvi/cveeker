import { apiService } from '../axios';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse, QueryParams } from './types';

export class BaseService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = "/api/v1/" + baseUrl;
  }

  /**
   * Build query string from parameters
   */
  protected buildQueryString(params?: QueryParams): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * GET request
   */
  protected async get<T = unknown>(
    endpoint: string, 
    params?: QueryParams, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}${endpoint}${queryString}`;
    return apiService.get<ApiResponse<T>>(url, config);
  }

  /**
   * POST request
   */
  protected async post<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return apiService.post<ApiResponse<T>>(url, data, config);
  }

  /**
   * PUT request
   */
  protected async put<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return apiService.put<ApiResponse<T>>(url, data, config);
  }

  /**
   * PATCH request
   */
  protected async patch<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return apiService.patch<ApiResponse<T>>(url, data, config);
  }

  /**
   * DELETE request
   */
  protected async delete<T = unknown>(
    endpoint: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return apiService.delete<ApiResponse<T>>(url, config);
  }
} 