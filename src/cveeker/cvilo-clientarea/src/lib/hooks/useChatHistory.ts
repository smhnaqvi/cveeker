import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatHistoryService } from '../services';

// Query keys for chat history
export const chatHistoryKeys = {
  all: ['chat-history'] as const,
  lists: () => [...chatHistoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...chatHistoryKeys.lists(), filters] as const,
  details: () => [...chatHistoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...chatHistoryKeys.details(), id] as const,
  byResume: (resumeId: number) => [...chatHistoryKeys.all, 'resume', resumeId] as const,
  byUser: (userId: number) => [...chatHistoryKeys.all, 'user', userId] as const,
  stats: (userId: number) => [...chatHistoryKeys.all, 'stats', userId] as const,
  recent: (resumeId: number, limit: number) => [...chatHistoryKeys.all, 'recent', resumeId, limit] as const,
};

/**
 * Hook to get chat history for a specific resume
 */
export const useChatHistoryByResume = (resumeId: number) => {
  return useQuery({
    queryKey: chatHistoryKeys.byResume(resumeId),
    queryFn: () => chatHistoryService.getChatHistoryByResume(resumeId),
    enabled: !!resumeId,
  });
};

/**
 * Hook to get recent chat history for a resume
 */
export const useRecentChatHistory = (resumeId: number, limit: number = 10) => {
  return useQuery({
    queryKey: chatHistoryKeys.recent(resumeId, limit),
    queryFn: () => chatHistoryService.getRecentChatHistory(resumeId, limit),
    enabled: !!resumeId,
  });
};

/**
 * Hook to get all chat history for a user
 */
export const useChatHistoryByUser = (userId: number) => {
  return useQuery({
    queryKey: chatHistoryKeys.byUser(userId),
    queryFn: () => chatHistoryService.getChatHistoryByUser(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to get chat history statistics for a user
 */
export const useChatHistoryStats = (userId: number) => {
  return useQuery({
    queryKey: chatHistoryKeys.stats(userId),
    queryFn: () => chatHistoryService.getChatHistoryStats(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to delete a specific chat history entry
 */
export const useDeleteChatHistory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (historyId: number) => chatHistoryService.deleteChatHistory(historyId),
    onSuccess: () => {
      // Invalidate all chat history queries
      queryClient.invalidateQueries({ queryKey: chatHistoryKeys.all });
    },
  });
};

/**
 * Hook to delete all chat history for a resume
 */
export const useDeleteChatHistoryByResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resumeId: number) => chatHistoryService.deleteChatHistoryByResume(resumeId),
    onSuccess: () => {
      // Invalidate all chat history queries
      queryClient.invalidateQueries({ queryKey: chatHistoryKeys.all });
    },
  });
}; 