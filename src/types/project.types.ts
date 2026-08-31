export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription?: string;
  coverImage?: string;
  galleryImages?: string[];
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  startDate?: string;
  completionDate?: string;
  projectType: 'web' | 'mobile' | 'fullstack' | 'cli' | 'open-source' | 'other';
  status: 'completed' | 'in-progress' | 'maintained' | 'archived';
  keyFeatures?: string[];
  challenges?: string;
  solution?: string;
  outcome?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
