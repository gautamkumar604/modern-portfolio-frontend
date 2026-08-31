export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: number;
  icon?: string;
  description?: string;
  displayOrder: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillsResponse {
  data: Skill[];
  total: number;
}
