import type { MetadataRoute } from 'next'
import { DOMAIN } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow URLs with query parameters via explicit patterns
        // Note: robots.txt doesn't support query string matching directly,
        // but pages with query params should set noindex via metadata
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}


