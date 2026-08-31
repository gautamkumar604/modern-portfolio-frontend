export interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  detailedDescription?: string;
  icon?: string;
  features: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  data: Service[];
  total: number;
}
