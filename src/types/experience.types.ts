export interface Experience {
  _id: string;
  company: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  description?: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceResponse {
  data: Experience[];
  total: number;
}
