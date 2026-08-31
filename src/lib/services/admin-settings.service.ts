import { apiClient } from '../api/client';
import { SiteSetting } from '@/types';

export const adminSettingsService = {
  getSiteSettings: async (): Promise<SiteSetting> => {
    return apiClient.get<SiteSetting>('/admin/site-settings', undefined, {
      withCredentials: true,
    });
  },

  updateSiteSettings: async (dto: Partial<SiteSetting>): Promise<SiteSetting> => {
    return apiClient.patch<SiteSetting>('/admin/site-settings', dto, {
      withCredentials: true,
    });
  },
};
