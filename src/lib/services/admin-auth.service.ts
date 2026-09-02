import { apiClient } from '../api/client';
import { AdminLoginResponse, AdminUser } from '@/types';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const adminAuthService = {
  login: async (email: string, password: string): Promise<AdminLoginResponse> => {
    return apiClient.post<AdminLoginResponse>(
      '/auth/login',
      { email, password },
      { withCredentials: true },
    );
  },

  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      '/auth/logout',
      {},
      { withCredentials: true },
    );
  },

  getMe: async (): Promise<AdminUser> => {
    return apiClient.get<AdminUser>('/auth/me', undefined, {
      withCredentials: true,
    });
  },

  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      '/auth/change-password',
      payload,
      { withCredentials: true },
    );
  },
};
