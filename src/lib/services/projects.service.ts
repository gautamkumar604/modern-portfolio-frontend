import { apiClient } from '../api/client';
import { Project, ProjectsResponse } from '@/types';

export const projectsService = {
  getProjects: async (params?: Record<string, string | number | boolean | undefined>): Promise<ProjectsResponse> => {
    return apiClient.get<ProjectsResponse>('/projects', params);
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    return apiClient.get<Project>(`/projects/${encodeURIComponent(slug)}`);
  },
};
