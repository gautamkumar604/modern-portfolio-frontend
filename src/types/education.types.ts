export interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  location?: string;
  description?: string;
  grade?: string;
  achievements: string[];
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationResponse {
  data: Education[];
  total: number;
}
