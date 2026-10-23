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

export interface ToolSubmission {
  id: string;
  name: string;
  url: string;
  category: string;
  pricing: PricingType;
  description: string;
  iconUrl?: string;
  submittedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementText?: string;
  showAnnouncement: boolean;
  contactEmail?: string;
  twitterUrl?: string;
  githubUrl?: string;
  telegramUrl?: string;
}

export interface DashboardMetrics {
  totalTools: number;
  publishedTools: number;
  totalViews: number;
  totalClicks: number;
  totalCategories: number;
  pendingSubmissions: number;
}
