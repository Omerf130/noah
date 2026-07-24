import { formatAdminPrice } from './admin-display'

export type CoursePriceDisplay = {
  primaryLabel: string
  regularLabel: string | null
  saleLabel: string | null
  isFree: boolean
}

type CoursePriceInput = {
  price: number
  salePrice?: number | null
  currency: string
}

export function formatCoursePriceDisplay(input: CoursePriceInput): CoursePriceDisplay {
  const salePrice = input.salePrice ?? null
  const hasSale = salePrice !== null && salePrice !== undefined

  if (input.price === 0 && !hasSale) {
    return {
      primaryLabel: 'חינם',
      regularLabel: null,
      saleLabel: null,
      isFree: true,
    }
  }

  const regularLabel = formatAdminPrice(input.price, input.currency)

  if (!hasSale) {
    return {
      primaryLabel: regularLabel,
      regularLabel: null,
      saleLabel: null,
      isFree: false,
    }
  }

  const saleLabel = formatAdminPrice(salePrice, input.currency)

  return {
    primaryLabel: saleLabel,
    regularLabel,
    saleLabel,
    isFree: false,
  }
}
