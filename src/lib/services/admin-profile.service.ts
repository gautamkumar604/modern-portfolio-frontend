import { apiClient } from '../api/client';
import { Profile } from '@/types';

function sanitizePayload<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized = { ...data };
  delete sanitized._id;
  delete sanitized.id;
  delete sanitized.createdAt;
  delete sanitized.updatedAt;
  delete sanitized.__v;
  return sanitized;
}

export const adminProfileService = {
  getProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/admin/profile', undefined, {
      withCredentials: true,
    });
  },

  updateProfile: async (dto: Partial<Profile>): Promise<Profile> => {
    const payload = sanitizePayload(dto);
    return apiClient.patch<Profile>('/admin/profile', payload, {
      withCredentials: true,
    });
  },
};
