export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive?: boolean;
  lastLogin?: string;
}

export interface AdminLoginResponse {
  message: string;
  token?: string;
  user: AdminUser;
}

export interface AdminQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isVisible?: boolean;
  isActive?: boolean;
  projectType?: string;
  employmentType?: string;
  category?: string;
}

export interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMessagesResponse {
  data: AdminMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
