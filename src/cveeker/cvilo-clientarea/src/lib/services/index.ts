// Export all types
export * from './types';
export * from './resume.type';

// Export base service class
export { BaseService } from './base';

// Export service instances
export { authService } from './auth.service';
export { userService } from './user.service';
export { resumeService } from './resume.service';

// Export service classes (for advanced usage)
export { AuthService } from './auth.service';
export { UserService } from './user.service';
export { ResumeService } from './resume.service';

// Re-export axios configuration
export { apiService, default as api } from '../axios'; 