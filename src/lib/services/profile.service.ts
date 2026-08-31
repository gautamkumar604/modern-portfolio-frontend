import { apiClient } from '../api/client';
import { Profile } from '@/types';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/profile');
  },
};
