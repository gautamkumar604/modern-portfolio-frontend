import { apiClient } from '../api/client';
import { ServicesResponse } from '@/types';

export const servicesService = {
  getServices: async (): Promise<ServicesResponse> => {
    return apiClient.get<ServicesResponse>('/services');
  },
};
