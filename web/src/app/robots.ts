import type { MetadataRoute } from 'next'
import { DOMAIN } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}


