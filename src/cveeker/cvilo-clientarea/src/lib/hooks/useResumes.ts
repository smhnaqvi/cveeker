/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService, type CreateResumeRequest, type UpdateResumeRequest, type ResumeSearchParams } from '../services';

// Query keys
export const resumeKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (filters: ResumeSearchParams) => [...resumeKeys.lists(), filters] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (id: number) => [...resumeKeys.details(), id] as const,
  user: (userId: number) => [...resumeKeys.all, 'user', userId] as const,
};

// Hook to fetch all resumes with filters
export const useResumes = (params?: ResumeSearchParams) => {
  return useQuery({
    queryKey: resumeKeys.list(params || {}),
    queryFn: () => resumeService.getAllResumes(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to fetch a single resume
export const useResume = (id: number) => {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => resumeService.getResume(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch resumes by user
export const useUserResumes = (userId: number) => {
  return useQuery({
    queryKey: resumeKeys.user(userId),
    queryFn: () => resumeService.getResumesByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a resume
export const useCreateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateResumeRequest) => resumeService.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to update a resume
export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateResumeRequest }) => 
      resumeService.updateResume(id, data),
    onSuccess: (response, { id }) => {
      queryClient.setQueryData(resumeKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to delete a resume
export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => resumeService.deleteResume(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: resumeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to toggle resume status
export const useToggleResumeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => resumeService.toggleResumeStatus(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData(resumeKeys.detail(id), (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              is_active: response.data?.is_active
            }
          };
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to clone a resume
export const useCloneResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => resumeService.cloneResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to create resume from form data
export const useCreateResumeFromForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, userId }: { formData: any; userId: number }) => 
      resumeService.createResumeFromForm(formData, userId),
    onSuccess: () => {
      // Invalidate and refetch resume lists
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to update resume from form data
export const useUpdateResumeFromForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: any }) => 
      resumeService.updateResumeFromForm(id, formData),
    onSuccess: (response, { id }) => {
      // Update the specific resume in cache
      queryClient.setQueryData(resumeKeys.detail(id), response);
      // Invalidate and refetch resume lists
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
};

// Hook to get resume with parsed form data
export const useResumeFormData = (id: number) => {
  return useQuery({
    queryKey: [...resumeKeys.detail(id), 'formData'],
    queryFn: () => resumeService.getResumeFormData(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search resumes
export const useSearchResumes = (query: string, params?: ResumeSearchParams) => {
  return useQuery({
    queryKey: [...resumeKeys.lists(), 'search', query, params],
    queryFn: () => resumeService.searchResumes(query, params),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get resume statistics
export const useResumeStats = () => {
  return useQuery({
    queryKey: [...resumeKeys.all, 'stats'],
    queryFn: () => resumeService.getResumeStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get resume templates
export const useResumeTemplates = () => {
  return useQuery({
    queryKey: [...resumeKeys.all, 'templates'],
    queryFn: () => resumeService.getTemplates(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}; 