const QUARTER_HOUR_STEP = 0.25

export function isValidEstimatedDurationHours(hours: number): boolean {
  if (!Number.isFinite(hours) || hours < 0) {
    return false
  }

  const scaled = hours / QUARTER_HOUR_STEP
  return Math.abs(scaled - Math.round(scaled)) < 1e-9
}

export function parseEstimatedDurationHours(input: unknown): number | undefined {
  if (input === '' || input === null || input === undefined) {
    return undefined
  }

  const hours = typeof input === 'number' ? input : Number(input)

  if (!Number.isFinite(hours) || hours < 0 || !isValidEstimatedDurationHours(hours)) {
    return undefined
  }

  return hours
}

export function hoursToEstimatedMinutes(hours: number): number {
  return Math.round(hours * 60)
}

export function estimatedMinutesToHours(minutes: number | undefined | null): string {
  if (minutes === undefined || minutes === null) {
    return ''
  }

  const hours = minutes / 60
  if (Number.isInteger(hours)) {
    return String(hours)
  }

  return String(Number(hours.toFixed(2)))
}

export function formatEstimatedDuration(minutes: number | undefined | null): string | null {
  if (minutes === undefined || minutes === null) {
    return null
  }

  if (minutes === 0) {
    return '0 דקות'
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${minutes} דקות`
  }

  if (remainingMinutes === 0) {
    if (hours === 1) {
      return 'כשעה'
    }

    if (hours === 2) {
      return 'כשעתיים'
    }

    return `${hours} שעות`
  }

  const hoursPart =
    hours === 1 ? 'שעה' : hours === 2 ? 'שעתיים' : `${hours} שעות`

  return `כ־${hoursPart} ו־${remainingMinutes} דקות`
}
