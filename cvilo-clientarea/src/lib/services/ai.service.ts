import { BaseService } from './base';
import type { ApiResponse } from './types';

export interface AIResumeRequest {
  prompt: string;
  user_id: number;
  resume_id?: number;
  template?: string;
  theme?: string;
}

export interface AIResumeResponse {
  success: boolean;
  message: string;
  data?: {
    resume: Record<string, unknown>;
    ai_response: Record<string, unknown>;
  };
  error?: string;
}

export interface AIServiceStatus {
  status: string;
  message: string;
  openai_configured: boolean;
  github_models_configured: boolean;
  active_provider: string;
  use_github_models: boolean;
}

export class AIService extends BaseService {
  constructor() {
    super('ai');
  }

  /**
   * Generate a new resume using AI
   * POST /api/ai/generate
   */
  async generateResume(request: AIResumeRequest): Promise<ApiResponse<AIResumeResponse>> {
    return this.post<AIResumeResponse>('/generate', request);
  }

  /**
   * Update an existing resume using AI
   * POST /api/ai/update
   */
  async updateResume(request: AIResumeRequest): Promise<ApiResponse<AIResumeResponse>> {
    return this.post<AIResumeResponse>('/update', request);
  }

  /**
   * Get AI service status
   * GET /api/ai/status
   */
  async getStatus(): Promise<ApiResponse<AIServiceStatus>> {
    return this.get<AIServiceStatus>('/status');
  }

  /**
   * Generate resume for specific user
   * POST /api/ai/users/:user_id/generate
   */
  async generateResumeForUser(userId: number, request: Omit<AIResumeRequest, 'user_id'>): Promise<ApiResponse<AIResumeResponse>> {
    return this.post<AIResumeResponse>(`/users/${userId}/generate`, request);
  }

  /**
   * Update specific resume for user
   * POST /api/ai/users/:user_id/resumes/:resume_id/update
   */
  async updateResumeForUser(userId: number, resumeId: number, request: Omit<AIResumeRequest, 'user_id' | 'resume_id'>): Promise<ApiResponse<AIResumeResponse>> {
    return this.post<AIResumeResponse>(`/users/${userId}/resumes/${resumeId}/update`, request);
  }
}

// Export singleton instance
export const aiService = new AIService(); 