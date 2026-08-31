import { apiClient } from '../api/client';
import { SocialLinksResponse } from '@/types';

export const socialLinksService = {
  getSocialLinks: async (): Promise<SocialLinksResponse> => {
    return apiClient.get<SocialLinksResponse>('/social-links');
  },
};
