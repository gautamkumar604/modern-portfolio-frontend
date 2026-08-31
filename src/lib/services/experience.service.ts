import { apiClient } from '../api/client';
import { ExperienceResponse } from '@/types';

export const experienceService = {
  getExperience: async (): Promise<ExperienceResponse> => {
    return apiClient.get<ExperienceResponse>('/experience');
  },
};
