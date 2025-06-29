import type { User } from "./types";

// Resume form field types based on CreateResume.tsx schema
export interface WorkExperience {
  company: string;
  position: string;
  location: string;
  startDate: string; // Will be converted to time.Time on backend
  endDate: string; // Will be converted to *time.Time on backend
  isCurrent: boolean;
  description: string;
  technologies: string; // Comma-separated string for frontend, will be parsed to []string on backend
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string; // Will be converted to time.Time on backend
  endDate: string; // Will be converted to *time.Time on backend
  gpa: string;
  description: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number;
  yearsExp: number;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string; // Will be converted to time.Time on backend
  expiryDate: string; // Will be converted to *time.Time on backend
  credentialID: string;
  url: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string; // Comma-separated string for frontend, will be parsed to []string on backend
  startDate: string; // Will be converted to time.Time on backend
  endDate: string; // Will be converted to *time.Time on backend
  url: string;
  github: string;
}

// Main Resume interface matching the form structure
export interface ResumeFormData {
  title: string;
  isActive: boolean;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  objective: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  awards: string;
  interests: string;
  references: string;
  template: string;
  theme: string;
}

// API Resume types matching the Go ResumeModel structure
export interface Resume {
  id: number;
  user_id: number;
  user?: User;
  title: string;
  is_active: boolean;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  objective: string;
  experience: string; // JSON string of WorkExperience array
  education: string; // JSON string of Education array
  skills: string; // JSON string of skills array
  languages: string; // JSON string of languages array
  certifications: string; // JSON string of certifications array
  projects: string; // JSON string of projects array
  awards: string;
  interests: string;
  references: string;
  template: string;
  theme: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Request types for API calls matching Go controller expectations
export interface CreateResumeRequest {
  user_id: number;
  title: string;
  is_active?: boolean;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  objective?: string;
  experience?: string; // JSON string
  education?: string; // JSON string
  skills?: string; // JSON string
  languages?: string; // JSON string
  certifications?: string; // JSON string
  projects?: string; // JSON string
  awards?: string;
  interests?: string;
  references?: string;
  template?: string;
  theme?: string;
}

export interface UpdateResumeRequest {
  title?: string;
  is_active?: boolean;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  objective?: string;
  experience?: string; // JSON string
  education?: string; // JSON string
  skills?: string; // JSON string
  languages?: string; // JSON string
  certifications?: string; // JSON string
  projects?: string; // JSON string
  awards?: string;
  interests?: string;
  references?: string;
  template?: string;
  theme?: string;
}

// API Response types matching actual Go controller responses
export interface ResumeListResponse {
  resumes: Resume[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface UserResumesResponse {
  user: User;
  resumes: Resume[];
  count: number;
}

export interface ResumeResponse {
  message?: string;
  resume: Resume;
}

export interface ResumeStatusResponse {
  message: string;
  is_active: boolean;
}

export interface CloneResumeResponse {
  message: string;
  original_id: number;
  cloned_resume: Resume;
}

// Template types
export interface ResumeTemplate {
  id: string;
  name: string;
  preview: string;
  category: string;
  description?: string;
}

// Export types
export interface ExportResponse {
  downloadUrl: string;
  filename?: string;
  expiresAt?: string;
}

// Share types
export interface ShareOptions {
  expiresAt?: string;
  password?: string;
  allowDownload?: boolean;
  allowPrint?: boolean;
}

export interface ShareResponse {
  shareUrl: string;
  expiresAt?: string;
  token: string;
}

// Statistics types
export interface ResumeStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  active: number;
  inactive: number;
}

// Bulk operation types
export interface BulkOperationRequest {
  ids: number[];
}

export interface BulkOperationResponse {
  deleted?: number;
  duplicated?: number;
  failed: number;
  errors?: Array<{ id: number; error: string }>;
}

// Search and filter types - extending QueryParams from main types
export interface ResumeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  template?: string;
  is_active?: boolean;
  user_id?: number;
  sort_by?: 'created_at' | 'updated_at' | 'title';
  sort_order?: 'asc' | 'desc';
  [key: string]: unknown; // Index signature to satisfy QueryParams
}

// Form validation types (for reference)
export interface ResumeFormValidation {
  title: string;
  fullName: string;
  email: string;
  phone: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  certifications: Array<{
    name: string;
  }>;
  projects: Array<{
    name: string;
  }>;
}
