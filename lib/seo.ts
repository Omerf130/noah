import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from './site'

type PageSeoInput = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogType = 'website',
  noIndex = false,
}: PageSeoInput): Metadata {
  const canonical = getSiteUrl(path)
  const fullTitle = path === '/' ? siteConfig.title : `${title} | ${siteConfig.name}`

  return {
    title: path === '/' ? { absolute: siteConfig.title } : title,
    description,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      locale: siteConfig.locale,
      type: ogType,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  }
}

export function buildWebPageJsonLd(input: {
  title: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.title,
    description: input.description,
    url: getSiteUrl(input.path),
    inLanguage: 'he-IL',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: getSiteUrl('/'),
    },
  }
}

export function buildCourseJsonLd(input: {
  title: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.title,
    description: input.description,
    url: getSiteUrl(input.path),
    inLanguage: 'he-IL',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: getSiteUrl('/'),
    },
    courseMode: 'online',
  }
}

export function buildProductJsonLd(input: {
  title: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.title,
    description: input.description,
    url: getSiteUrl(input.path),
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
  }
}
