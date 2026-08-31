import { apiClient } from '../api/client';
import { AdminMessage, AdminMessagesResponse } from '@/types';

export const adminMessagesService = {
  getMessages: async (params?: Record<string, string | number | boolean | undefined>): Promise<AdminMessagesResponse> => {
    return apiClient.get<AdminMessagesResponse>('/admin/messages', params, {
      withCredentials: true,
    });
  },

  getMessageById: async (id: string): Promise<AdminMessage> => {
    return apiClient.get<AdminMessage>(`/admin/messages/${id}`, undefined, {
      withCredentials: true,
    });
  },

  updateMessage: async (id: string, dto: Partial<AdminMessage>): Promise<AdminMessage> => {
    return apiClient.patch<AdminMessage>(`/admin/messages/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteMessage: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/messages/${id}`, {
      withCredentials: true,
    });
  },
};
