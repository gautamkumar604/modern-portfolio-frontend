import { apiClient } from '../api/client';
import { SiteSetting } from '@/types';

export const siteSettingsService = {
  getSiteSettings: async (): Promise<SiteSetting> => {
    return apiClient.get<SiteSetting>('/site-settings');
  },
};
