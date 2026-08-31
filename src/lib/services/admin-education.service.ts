import { apiClient } from '../api/client';
import { Education, EducationResponse } from '@/types';

export const adminEducationService = {
  getEducation: async (params?: Record<string, string | number | boolean | undefined>): Promise<EducationResponse> => {
    return apiClient.get<EducationResponse>('/admin/education', params, {
      withCredentials: true,
    });
  },

  getEducationById: async (id: string): Promise<Education> => {
    return apiClient.get<Education>(`/admin/education/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createEducation: async (dto: Partial<Education>): Promise<Education> => {
    return apiClient.post<Education>('/admin/education', dto, {
      withCredentials: true,
    });
  },

  updateEducation: async (id: string, dto: Partial<Education>): Promise<Education> => {
    return apiClient.patch<Education>(`/admin/education/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteEducation: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/education/${id}`, {
      withCredentials: true,
    });
  },
};
