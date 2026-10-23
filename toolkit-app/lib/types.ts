export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Open Source';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  url: string;
  iconUrl: string;
  category: string;
  tags: string[];
  pricing: PricingType;
  featured: boolean;
  status: 'published' | 'draft';
  views: number;
  clicks: number;
  rating: number;
  createdAt: string;
  features?: string[];
  author?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count?: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementText?: string;
  showAnnouncement: boolean;
  authorName: string;
  brandTag: string;
  whatsappUrl?: string;
  youtubeUrl?: string;
  contactEmail?: string;
  telegramUrl?: string;
}
