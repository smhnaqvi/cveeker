import { BaseService } from './base';
import type { 
  ApiResponse, 
  LinkedInAuthRequest,
  LinkedInAuthResponse,
  LinkedInAuthURLResponse
} from './types';

// LinkedIn profile response type
interface LinkedInProfileResponse {
  resume: {
    id: number;
    title: string;
    full_name: string;
    summary: string;
    linkedin: string;
    created_at: string;
  };
}

// LinkedIn sync response type
interface LinkedInSyncResponse {
  resume: {
    id: number;
    title: string;
    full_name: string;
    summary: string;
    linkedin: string;
    created_at: string;
  };
}

export class LinkedInService extends BaseService {
  constructor() {
    super('linkedin');
  }

  /**
   * Get LinkedIn OAuth authorization URL
   */
  async getAuthURL(state?: string): Promise<ApiResponse<LinkedInAuthURLResponse>> {
    const params = new URLSearchParams();
    if (state) {
      params.append('state', state);
    }
    return this.get<LinkedInAuthURLResponse>(`/auth-url?${params.toString()}`);
  }

  /**
   * Handle LinkedIn OAuth callback
   */
  async handleCallback(request: LinkedInAuthRequest): Promise<ApiResponse<LinkedInAuthResponse>> {
    return this.post<LinkedInAuthResponse>('/callback', request);
  }

  /**
   * Get LinkedIn profile data for a user
   */
  async getProfile(userId: number): Promise<ApiResponse<LinkedInProfileResponse>> {
    return this.get<LinkedInProfileResponse>(`/profile/${userId}`);
  }

  /**
   * Sync LinkedIn profile data for a user
   */
  async syncProfile(userId: number): Promise<ApiResponse<LinkedInSyncResponse>> {
    return this.post<LinkedInSyncResponse>(`/sync/${userId}`);
  }

  /**
   * Disconnect LinkedIn for a user
   */
  async disconnect(userId: number): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(`/disconnect/${userId}`);
  }
}

// Export singleton instance
export const linkedInService = new LinkedInService(); 