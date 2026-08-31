import { apiClient } from '../api/client';
import { Skill, SkillsResponse } from '@/types';

export const adminSkillsService = {
  getSkills: async (params?: Record<string, string | number | boolean | undefined>): Promise<SkillsResponse> => {
    return apiClient.get<SkillsResponse>('/admin/skills', params, {
      withCredentials: true,
    });
  },

  getSkillById: async (id: string): Promise<Skill> => {
    return apiClient.get<Skill>(`/admin/skills/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createSkill: async (dto: Partial<Skill>): Promise<Skill> => {
    return apiClient.post<Skill>('/admin/skills', dto, {
      withCredentials: true,
    });
  },

  updateSkill: async (id: string, dto: Partial<Skill>): Promise<Skill> => {
    return apiClient.patch<Skill>(`/admin/skills/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteSkill: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/skills/${id}`, {
      withCredentials: true,
    });
  },
};
