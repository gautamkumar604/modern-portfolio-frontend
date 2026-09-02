import { apiClient } from '../api/client';
import { SiteSetting } from '@/types';

function sanitizePayload<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized = { ...data };
  delete sanitized._id;
  delete sanitized.id;
  delete sanitized.createdAt;
  delete sanitized.updatedAt;
  delete sanitized.__v;
  return sanitized;
}

export const adminSettingsService = {
  getSiteSettings: async (): Promise<SiteSetting> => {
    return apiClient.get<SiteSetting>('/admin/site-settings', undefined, {
      withCredentials: true,
    });
  },

  updateSiteSettings: async (dto: Partial<SiteSetting>): Promise<SiteSetting> => {
    const payload = sanitizePayload(dto);
    return apiClient.patch<SiteSetting>('/admin/site-settings', payload, {
      withCredentials: true,
    });
  },
};
