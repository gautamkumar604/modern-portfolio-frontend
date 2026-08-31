import { apiClient } from '../api/client';
import { Profile } from '@/types';

export const adminProfileService = {
  getProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/admin/profile', undefined, {
      withCredentials: true,
    });
  },

  updateProfile: async (dto: Partial<Profile>): Promise<Profile> => {
    return apiClient.patch<Profile>('/admin/profile', dto, {
      withCredentials: true,
    });
  },
};
