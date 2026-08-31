import { apiClient } from '../api/client';
import { SocialLink, SocialLinksResponse } from '@/types';

export const adminSocialService = {
  getSocialLinks: async (params?: Record<string, string | number | boolean | undefined>): Promise<SocialLinksResponse> => {
    return apiClient.get<SocialLinksResponse>('/admin/social-links', params, {
      withCredentials: true,
    });
  },

  getSocialLinkById: async (id: string): Promise<SocialLink> => {
    return apiClient.get<SocialLink>(`/admin/social-links/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createSocialLink: async (dto: Partial<SocialLink>): Promise<SocialLink> => {
    return apiClient.post<SocialLink>('/admin/social-links', dto, {
      withCredentials: true,
    });
  },

  updateSocialLink: async (id: string, dto: Partial<SocialLink>): Promise<SocialLink> => {
    return apiClient.patch<SocialLink>(`/admin/social-links/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteSocialLink: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/social-links/${id}`, {
      withCredentials: true,
    });
  },
};
