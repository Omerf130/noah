import type { BlockBase } from './base'

export interface FileBlockData {
  mediaAssetId: string
  label: string
  allowDownload: boolean
}

export interface FileBlock extends BlockBase {
  type: 'file'
  data: FileBlockData
}
