import type { ContentBlockType } from '../constants/content-block'

const contentBlockTypeLabels: Record<ContentBlockType, string> = {
  richText: 'טקסט עשיר',
}

export function getContentBlockTypeLabel(type: ContentBlockType): string {
  return contentBlockTypeLabels[type]
}
