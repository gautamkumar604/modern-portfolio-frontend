export interface SiteSetting {
  _id?: string;
  siteName: string;
  tagline?: string;
  faviconUrl?: string;
  logoUrl?: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  keywords?: string[];
  ogImageUrl?: string;
  contactEmail?: string;
  footerText?: string;
  copyrightText?: string;
  isMaintenanceMode: boolean;
  analyticsId?: string;
  createdAt?: string;
  updatedAt?: string;
}
