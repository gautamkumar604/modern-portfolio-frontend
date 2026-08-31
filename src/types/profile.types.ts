export interface Profile {
  _id?: string;
  name: string;
  title: string;
  heroGreeting?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  shortBio: string;
  detailedBio?: string;
  avatarUrl?: string;
  location?: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  availabilityStatus: 'available' | 'busy' | 'open_to_offers' | 'unavailable';
  yearsOfExperience?: number;
  highlights: string[];
  createdAt?: string;
  updatedAt?: string;
}
