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
    const { _id, createdAt, updatedAt, __v, ...cleanDto } = dto as any;
    if (cleanDto.proficiency !== undefined) cleanDto.proficiency = Number(cleanDto.proficiency);
    if (cleanDto.displayOrder !== undefined) cleanDto.displayOrder = Number(cleanDto.displayOrder);
    return apiClient.post<Skill>('/admin/skills', cleanDto, {
      withCredentials: true,
    });
  },

  updateSkill: async (id: string, dto: Partial<Skill>): Promise<Skill> => {
    const { _id, createdAt, updatedAt, __v, ...cleanDto } = dto as any;
    if (cleanDto.proficiency !== undefined) cleanDto.proficiency = Number(cleanDto.proficiency);
    if (cleanDto.displayOrder !== undefined) cleanDto.displayOrder = Number(cleanDto.displayOrder);
    return apiClient.patch<Skill>(`/admin/skills/${id}`, cleanDto, {
      withCredentials: true,
    });
  },

  deleteSkill: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/skills/${id}`, {
      withCredentials: true,
    });
  },
};
