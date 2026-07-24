export const COURSE_STATUSES = ['draft', 'published', 'archived'] as const
export const COURSE_VISIBILITIES = ['public', 'unlisted', 'private', 'members'] as const
export const COURSE_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
export const COURSE_CATEGORIES = [
  'calculations',
  'pharmacology',
  'anatomy',
  'nursing-fundamentals',
] as const

export const LESSON_STATUSES = ['draft', 'published'] as const

export const BLOCK_TYPES = ['richText', 'video', 'file', 'callout', 'divider'] as const

export const MEDIA_ASSET_KINDS = ['image', 'document', 'audio', 'other'] as const
export const STORAGE_PROVIDERS = ['local', 's3', 'cloudflare-r2'] as const

export const VIDEO_PROVIDERS = ['pending', 'bunny', 'cloudflare', 'vimeo'] as const
export const VIDEO_STATUSES = ['uploading', 'processing', 'ready', 'failed'] as const

export const CALLOUT_VARIANTS = ['info', 'warning', 'tip'] as const
export const RICH_TEXT_FORMATS = ['markdown', 'html'] as const

export const RELEASE_RULE_TYPES = ['immediate', 'daysAfterEnrollment', 'fixedDate'] as const
export const DRIP_RELEASE_STRATEGIES = ['immediate', 'sequential', 'scheduled'] as const
export const LOCK_STRATEGIES = ['none', 'sequential', 'prerequisite'] as const

export const DEFAULT_CURRENCY = 'ILS'
export const MODULE_ORDER_GAP = 100
export const LESSON_ORDER_GAP = 100

export const ADMIN_COURSE_LIST_PAGE_SIZE = 10

export const INTERNAL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
