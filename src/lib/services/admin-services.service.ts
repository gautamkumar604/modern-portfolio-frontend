import { apiClient } from '../api/client';
import { Service, ServicesResponse } from '@/types';

export const adminServicesService = {
  getServices: async (params?: Record<string, string | number | boolean | undefined>): Promise<ServicesResponse> => {
    return apiClient.get<ServicesResponse>('/admin/services', params, {
      withCredentials: true,
    });
  },

  getServiceById: async (id: string): Promise<Service> => {
    return apiClient.get<Service>(`/admin/services/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createService: async (dto: Partial<Service>): Promise<Service> => {
    return apiClient.post<Service>('/admin/services', dto, {
      withCredentials: true,
    });
  },

  updateService: async (id: string, dto: Partial<Service>): Promise<Service> => {
    return apiClient.patch<Service>(`/admin/services/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteService: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/services/${id}`, {
      withCredentials: true,
    });
  },
};
