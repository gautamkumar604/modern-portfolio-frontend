export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinksResponse {
  data: SocialLink[];
  total: number;
}
