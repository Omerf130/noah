import type { BlockBase } from './base'

export interface CalloutBlockData {
  variant: 'info' | 'warning' | 'tip'
  title?: string
  body: string
}

export interface CalloutBlock extends BlockBase {
  type: 'callout'
  data: CalloutBlockData
}
