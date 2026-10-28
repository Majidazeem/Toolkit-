import { MetadataRoute } from 'next';
import { INITIAL_TOOLS, INITIAL_CATEGORIES } from '../lib/seedData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://legendmod.net';
  const now = new Date();

  // Primary Site Routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#utilities`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#hosting`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Category Filters
  const categoryRoutes: MetadataRoute.Sitemap = INITIAL_CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map((cat) => ({
      url: `${baseUrl}/?category=${cat.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Tools Deep Indexing
  const toolRoutes: MetadataRoute.Sitemap = INITIAL_TOOLS
    .filter(t => t.status === 'published')
    .map((tool) => ({
      url: `${baseUrl}/?tool=${tool.slug || tool.id}`,
      lastModified: new Date(tool.createdAt || now),
      changeFrequency: 'monthly',
      priority: tool.featured ? 0.9 : 0.7,
    }));

  return [...coreRoutes, ...categoryRoutes, ...toolRoutes];
}
