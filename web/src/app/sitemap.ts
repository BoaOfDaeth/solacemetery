import type { MetadataRoute } from 'next'
import { DOMAIN } from '@/lib/utils'
import { getHelpData } from '@/lib/help'
import { getAllClasses } from '@/lib/classes'
import { getAllRaces } from '@/lib/races'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = DOMAIN

  const staticPages = ['/', '/pvp', '/mvp', '/classes', '/races', '/help']

  const help = getHelpData()
  const helpUrls = Array.from(help.articlesMap.keys()).map((id) => ({
    url: `${base}/help/${id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const classes = getAllClasses().map((c) => ({
    url: `${base}/class/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const races = getAllRaces().map((r) => ({
    url: `${base}/race/${r.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages.map((p) => ({
      url: `${base}${p}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
    ...helpUrls,
    ...classes,
    ...races,
  ]
}


