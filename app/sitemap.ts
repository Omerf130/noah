import type { MetadataRoute } from 'next'
import { marketingRoutes } from '../lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  return marketingRoutes.map(({ path, priority }) => ({
    url: baseUrl ? `${baseUrl}${path === '/' ? '' : path}` : path,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority,
  }))
}
