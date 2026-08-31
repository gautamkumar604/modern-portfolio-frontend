import { apiClient } from '../api/client';
import { Experience, ExperienceResponse } from '@/types';

export const adminExperienceService = {
  getExperience: async (params?: Record<string, string | number | boolean | undefined>): Promise<ExperienceResponse> => {
    return apiClient.get<ExperienceResponse>('/admin/experience', params, {
      withCredentials: true,
    });
  },

  getExperienceById: async (id: string): Promise<Experience> => {
    return apiClient.get<Experience>(`/admin/experience/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createExperience: async (dto: Partial<Experience>): Promise<Experience> => {
    return apiClient.post<Experience>('/admin/experience', dto, {
      withCredentials: true,
    });
  },

  updateExperience: async (id: string, dto: Partial<Experience>): Promise<Experience> => {
    return apiClient.patch<Experience>(`/admin/experience/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteExperience: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/experience/${id}`, {
      withCredentials: true,
    });
  },
};
