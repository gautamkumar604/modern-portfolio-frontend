import { apiClient } from '../api/client';
import { CreateMessageDto, CreateMessageResponse } from '@/types';

export const messagesService = {
  sendMessage: async (
    dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> => {
    return apiClient.post<CreateMessageResponse>('/messages', dto);
  },
};
