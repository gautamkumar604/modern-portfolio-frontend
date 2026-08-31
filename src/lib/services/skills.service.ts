import { apiClient } from '../api/client';
import { SkillsResponse } from '@/types';

export const skillsService = {
  getSkills: async (): Promise<SkillsResponse> => {
    return apiClient.get<SkillsResponse>('/skills');
  },
};
