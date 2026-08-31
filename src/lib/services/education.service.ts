import { apiClient } from '../api/client';
import { EducationResponse } from '@/types';

export const educationService = {
  getEducation: async (): Promise<EducationResponse> => {
    return apiClient.get<EducationResponse>('/education');
  },
};
