import type {
  COURSE_CATEGORIES,
  COURSE_DIFFICULTIES,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
  PUBLICATION_STATUSES,
  DRIP_RELEASE_STRATEGIES,
  LESSON_STATUSES,
  LOCK_STRATEGIES,
  MEDIA_ASSET_KINDS,
  RELEASE_RULE_TYPES,
  STORAGE_PROVIDERS,
  VIDEO_PROVIDERS,
  VIDEO_STATUSES,
} from './constants'

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number]
export type CourseStatus = (typeof COURSE_STATUSES)[number]
export type CourseVisibility = (typeof COURSE_VISIBILITIES)[number]
export type CourseDifficulty = (typeof COURSE_DIFFICULTIES)[number]
export type CourseCategory = (typeof COURSE_CATEGORIES)[number]
export type LessonStatus = (typeof LESSON_STATUSES)[number]

export type MediaAssetKind = (typeof MEDIA_ASSET_KINDS)[number]
export type StorageProvider = (typeof STORAGE_PROVIDERS)[number]

export type VideoProvider = (typeof VIDEO_PROVIDERS)[number]
export type VideoStatus = (typeof VIDEO_STATUSES)[number]

export type ReleaseRuleType = (typeof RELEASE_RULE_TYPES)[number]
export type DripReleaseStrategy = (typeof DRIP_RELEASE_STRATEGIES)[number]
export type LockStrategy = (typeof LOCK_STRATEGIES)[number]

export interface ReleaseRule {
  type: ReleaseRuleType
  value?: number | string
}

export interface CoursePricing {
  price: number
  salePrice?: number
  currency: string
}

export interface CourseSeo {
  title?: string
  description?: string
  ogImageAssetId?: string
}

export interface CourseDripSettings {
  enabled: boolean
  defaultReleaseStrategy?: DripReleaseStrategy
}

export interface CourseAccessRules {
  requiresEnrollment: boolean
  lockStrategy?: LockStrategy
}

export interface PendingProviderData {
  note?: string
}

export interface BunnyProviderData {
  libraryId?: string
  videoGuid?: string
}

export interface CloudflareProviderData {
  accountId?: string
  uid?: string
}

export type VideoProviderData = PendingProviderData | BunnyProviderData | CloudflareProviderData

export type { LessonBlock, BlockType } from './types/blocks'
