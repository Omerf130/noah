import type { BlockBase } from './base'

export type DividerBlockData = Record<string, never>

export interface DividerBlock extends BlockBase {
  type: 'divider'
  data: DividerBlockData
}
