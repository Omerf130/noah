import type { BlockBase } from './base'

export interface VideoBlockData {
  videoAssetId: string
  caption?: string
  autoplay?: boolean
}

export interface VideoBlock extends BlockBase {
  type: 'video'
  data: VideoBlockData
}
