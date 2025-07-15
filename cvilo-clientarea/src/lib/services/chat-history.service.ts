import { BaseService } from './base';
import type { ApiResponse } from './types';

export interface ChatPromptHistory {
  id: number;
  resume_id: number;
  user_id: number;
  prompt: string;
  response: string;
  provider: string;
  status: 'success' | 'failed' | 'partial';
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryStats {
  total_prompts: number;
  success_count: number;
  failed_count: number;
  provider_stats: Record<string, number>;
}

export interface ChatHistoryFilters {
  limit?: number;
  status?: string;
  provider?: string;
  date_from?: string;
  date_to?: string;
}

export class ChatHistoryService extends BaseService {
  constructor() {
    super('chat-history');
  }

  /**
   * Get chat history for a specific resume
   * GET /api/v1/chat-history/resumes/:resume_id
   */
  async getChatHistoryByResume(resumeId: number): Promise<ApiResponse<{
    resume_id: number;
    history: ChatPromptHistory[];
    count: number;
  }>> {
    return this.get<{
      resume_id: number;
      history: ChatPromptHistory[];
      count: number;
    }>(`/resumes/${resumeId}`);
  }

  /**
   * Get recent chat history for a resume
   * GET /api/v1/chat-history/resumes/:resume_id/recent?limit=10
   */
  async getRecentChatHistory(resumeId: number, limit: number = 10): Promise<ApiResponse<{
    resume_id: number;
    history: ChatPromptHistory[];
    count: number;
    limit: number;
  }>> {
    return this.get<{
      resume_id: number;
      history: ChatPromptHistory[];
      count: number;
      limit: number;
    }>(`/resumes/${resumeId}/recent`, { limit });
  }

  /**
   * Get all chat history for a user
   * GET /api/v1/chat-history/users/:user_id
   */
  async getChatHistoryByUser(userId: number): Promise<ApiResponse<{
    user_id: number;
    history: ChatPromptHistory[];
    count: number;
  }>> {
    return this.get<{
      user_id: number;
      history: ChatPromptHistory[];
      count: number;
    }>(`/users/${userId}`);
  }

  /**
   * Get chat history statistics for a user
   * GET /api/v1/chat-history/users/:user_id/stats
   */
  async getChatHistoryStats(userId: number): Promise<ApiResponse<ChatHistoryStats>> {
    return this.get<ChatHistoryStats>(`/users/${userId}/stats`);
  }

  /**
   * Delete a specific chat history entry
   * DELETE /api/v1/chat-history/:id
   */
  async deleteChatHistory(historyId: number): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${historyId}`);
  }

  /**
   * Delete all chat history for a resume
   * DELETE /api/v1/chat-history/resumes/:resume_id
   */
  async deleteChatHistoryByResume(resumeId: number): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/resumes/${resumeId}`);
  }
}

export const chatHistoryService = new ChatHistoryService(); 