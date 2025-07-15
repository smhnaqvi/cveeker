// Export all types
export * from './types';
export * from './resume.type';

// Export base service class
export { BaseService } from './base';

// Export service instances
export { authService } from './auth.service';
export { userService } from './user.service';
export { linkedInService } from './linkedin.service';
export { chatHistoryService } from './chat-history.service';
export { resumeService } from './resume.service';
export { aiService } from './ai.service';

// Export service classes (for advanced usage)
export { AuthService } from './auth.service';
export { UserService } from './user.service';
export { ResumeService } from './resume.service';
export { AIService } from './ai.service';

// Re-export axios configuration
export { apiService, default as api } from '../axios';

// Export React Query hooks
export * from '../hooks'; 

// Export chat history types
export type { 
  ChatPromptHistory, 
  ChatHistoryStats, 
  ChatHistoryFilters 
} from './chat-history.service'; 