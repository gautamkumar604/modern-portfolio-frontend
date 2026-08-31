import { apiClient } from '../api/client';
import { Project, ProjectsResponse } from '@/types';

export const adminProjectsService = {
  getProjects: async (params?: Record<string, string | number | boolean | undefined>): Promise<ProjectsResponse> => {
    return apiClient.get<ProjectsResponse>('/admin/projects', params, {
      withCredentials: true,
    });
  },

  getProjectById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(`/admin/projects/${id}`, undefined, {
      withCredentials: true,
    });
  },

  createProject: async (dto: Partial<Project>): Promise<Project> => {
    return apiClient.post<Project>('/admin/projects', dto, {
      withCredentials: true,
    });
  },

  updateProject: async (id: string, dto: Partial<Project>): Promise<Project> => {
    return apiClient.patch<Project>(`/admin/projects/${id}`, dto, {
      withCredentials: true,
    });
  },

  deleteProject: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/admin/projects/${id}`, {
      withCredentials: true,
    });
  },
};
