import { BaseService } from './base';
import type { 
  ApiResponse
} from './types';
import type {
  Resume,
  CreateResumeRequest,
  UpdateResumeRequest,
  ResumeTemplate,
  ExportResponse,
  ShareOptions,
  ShareResponse,
  ResumeStats,
  BulkOperationResponse,
  ResumeSearchParams,
  ResumeFormData,
  ResumeListResponse,
  UserResumesResponse,
  ResumeResponse,
  ResumeStatusResponse,
  CloneResumeResponse,
  WorkExperience,
  Education,
  Skill
} from './resume.type';

export class ResumeService extends BaseService {
  constructor() {
    super('resumes');
  }

  /**
   * Create a new resume
   * POST /api/resumes
   */
  async createResume(data: CreateResumeRequest): Promise<ApiResponse<ResumeResponse>> {
    return this.post<ResumeResponse>('', data);
  }

  /**
   * Get a single resume by ID
   * GET /api/resumes/:id
   */
  async getResume(id: number): Promise<ApiResponse<Resume>> {
    return this.get<Resume>(`/${id}`);
  }

  /**
   * Get all resumes for a specific user
   * GET /api/resumes/user/:id
   */
  async getResumesByUser(userId: number): Promise<ApiResponse<UserResumesResponse>> {
    return this.get<UserResumesResponse>(`/user/${userId}`);
  }

  /**
   * Get all resumes with pagination
   * GET /api/resumes?page=1&limit=10
   */
  async getAllResumes(params?: ResumeSearchParams): Promise<ApiResponse<ResumeListResponse>> {
    return this.get<ResumeListResponse>('', params);
  }

  /**
   * Update an existing resume
   * PUT /api/resumes/:id
   */
  async updateResume(id: number, data: UpdateResumeRequest): Promise<ApiResponse<ResumeResponse>> {
    return this.put<ResumeResponse>(`/${id}`, data);
  }

  /**
   * Delete a resume
   * DELETE /api/resumes/:id
   */
  async deleteResume(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${id}`);
  }

  /**
   * Toggle resume active status
   * PUT /api/resumes/:id/toggle-status
   */
  async toggleResumeStatus(id: number): Promise<ApiResponse<ResumeStatusResponse>> {
    return this.put<ResumeStatusResponse>(`/${id}/toggle-status`);
  }

  /**
   * Clone/duplicate a resume
   * POST /api/resumes/:id/clone
   */
  async cloneResume(id: number): Promise<ApiResponse<CloneResumeResponse>> {
    return this.post<CloneResumeResponse>(`/${id}/clone`);
  }

  /**
   * Parse experience data (helper endpoint)
   * POST /api/resumes/parse-experience
   */
  async parseExperience(experiences: WorkExperience[]): Promise<ApiResponse<{ parsed_data: string; count: number }>> {
    return this.post<{ parsed_data: string; count: number }>('/parse-experience', experiences);
  }

  /**
   * Parse education data (helper endpoint)
   * POST /api/resumes/parse-education
   */
  async parseEducation(education: Education[]): Promise<ApiResponse<{ parsed_data: string; count: number }>> {
    return this.post<{ parsed_data: string; count: number }>('/parse-education', education);
  }

  /**
   * Parse skills data (helper endpoint)
   * POST /api/resumes/parse-skills
   */
  async parseSkills(skills: Skill[]): Promise<ApiResponse<{ parsed_data: string; count: number }>> {
    return this.post<{ parsed_data: string; count: number }>('/parse-skills', skills);
  }

  // Enhanced methods for form integration

  /**
   * Create resume from form data
   * Converts form data to the format expected by the Go backend
   */
  async createResumeFromForm(formData: ResumeFormData, userId: number): Promise<ApiResponse<ResumeResponse>> {
    const createData: CreateResumeRequest = {
      user_id: userId,
      title: formData.title,
      is_active: formData.isActive,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      linkedin: formData.linkedin,
      github: formData.github,
      summary: formData.summary,
      objective: formData.objective,
      experience: JSON.stringify(formData.experience),
      education: JSON.stringify(formData.education),
      skills: JSON.stringify(formData.skills),
      languages: JSON.stringify(formData.languages),
      certifications: JSON.stringify(formData.certifications),
      projects: JSON.stringify(formData.projects),
      awards: formData.awards,
      interests: formData.interests,
      references: formData.references,
      template: formData.template,
      theme: formData.theme
    };
    return this.createResume(createData);
  }

  /**
   * Update resume from form data
   * Converts form data to the format expected by the Go backend
   */
  async updateResumeFromForm(id: number, formData: ResumeFormData): Promise<ApiResponse<ResumeResponse>> {
    const updateData: UpdateResumeRequest = {
      title: formData.title,
      is_active: formData.isActive,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      linkedin: formData.linkedin,
      github: formData.github,
      summary: formData.summary,
      objective: formData.objective,
      experience: JSON.stringify(formData.experience),
      education: JSON.stringify(formData.education),
      skills: JSON.stringify(formData.skills),
      languages: JSON.stringify(formData.languages),
      certifications: JSON.stringify(formData.certifications),
      projects: JSON.stringify(formData.projects),
      awards: formData.awards,
      interests: formData.interests,
      references: formData.references,
      template: formData.template,
      theme: formData.theme
    };
    return this.updateResume(id, updateData);
  }

  /**
   * Get resume with parsed form data
   * Retrieves resume and parses JSON strings back to form data structure
   */
  async getResumeFormData(id: number): Promise<ApiResponse<Resume & { parsedFormData?: ResumeFormData }>> {
    const response = await this.getResume(id);
    if (response.success && response.data) {
      try {
        // Parse JSON strings back to form data
        const parsedFormData: ResumeFormData = {
          title: response.data.title,
          isActive: response.data.is_active,
          fullName: response.data.full_name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          website: response.data.website,
          linkedin: response.data.linkedin,
          github: response.data.github,
          summary: response.data.summary,
          objective: response.data.objective,
          experience: JSON.parse(response.data.experience || '[]'),
          education: JSON.parse(response.data.education || '[]'),
          skills: JSON.parse(response.data.skills || '[]'),
          languages: JSON.parse(response.data.languages || '[]'),
          certifications: JSON.parse(response.data.certifications || '[]'),
          projects: JSON.parse(response.data.projects || '[]'),
          awards: response.data.awards,
          interests: response.data.interests,
          references: response.data.references,
          template: response.data.template,
          theme: response.data.theme
        };

        return {
          ...response,
          data: {
            ...response.data,
            parsedFormData
          }
        };
      } catch (error) {
        console.error('Error parsing resume form data:', error);
        return response;
      }
    }
    return response;
  }

  /**
   * Get resumes for current user (assuming user ID is available from auth)
   */
  async getCurrentUserResumes(): Promise<ApiResponse<UserResumesResponse>> {
    // This would typically get the current user ID from auth context
    // For now, we'll use a placeholder - you'll need to implement this based on your auth system
    const currentUserId = 1; // Replace with actual user ID from auth
    return this.getResumesByUser(currentUserId);
  }

  // Additional utility methods that might be useful

  /**
   * Search resumes by title or content
   */
  async searchResumes(query: string, params?: ResumeSearchParams): Promise<ApiResponse<ResumeListResponse>> {
    return this.get<ResumeListResponse>('/search', { ...params, search: query });
  }

  /**
   * Get resume statistics
   */
  async getResumeStats(): Promise<ApiResponse<ResumeStats>> {
    return this.get<ResumeStats>('/stats');
  }

  /**
   * Export resume as PDF (if implemented in backend)
   */
  async exportResumeAsPDF(id: number): Promise<ApiResponse<ExportResponse>> {
    return this.get<ExportResponse>(`/${id}/export/pdf`);
  }

  /**
   * Export resume as DOCX (if implemented in backend)
   */
  async exportResumeAsDOCX(id: number): Promise<ApiResponse<ExportResponse>> {
    return this.get<ExportResponse>(`/${id}/export/docx`);
  }

  /**
   * Share resume (if implemented in backend)
   */
  async shareResume(id: number, options?: ShareOptions): Promise<ApiResponse<ShareResponse>> {
    return this.post<ShareResponse>(`/${id}/share`, options);
  }

  /**
   * Get shared resume by token (if implemented in backend)
   */
  async getSharedResume(token: string, password?: string): Promise<ApiResponse<Resume>> {
    const data = password ? { password } : undefined;
    return this.post<Resume>(`/shared/${token}`, data);
  }

  /**
   * Get resume templates (if implemented in backend)
   */
  async getTemplates(): Promise<ApiResponse<ResumeTemplate[]>> {
    return this.get<ResumeTemplate[]>('/templates');
  }

  /**
   * Bulk operations (if implemented in backend)
   */
  async bulkDeleteResumes(ids: number[]): Promise<ApiResponse<BulkOperationResponse>> {
    return this.post<BulkOperationResponse>('/bulk-delete', { ids });
  }

  async bulkCloneResumes(ids: number[]): Promise<ApiResponse<BulkOperationResponse>> {
    return this.post<BulkOperationResponse>('/bulk-clone', { ids });
  }
}

// Export singleton instance
export const resumeService = new ResumeService(); 