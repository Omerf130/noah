import { formatUserDisplayName } from '../formatters/admin-display'

export type InstructorOptionDto = {
  id: string
  fullName: string
  disambiguationLabel?: string
}

export const INSTRUCTOR_OPTION_DTO_KEYS = ['id', 'fullName', 'disambiguationLabel'] as const

type InstructorLeanUser = {
  _id: { toString(): string }
  fullName: string
  email: string
}

function normalizeVisibleName(fullName: string): string {
  return formatUserDisplayName(fullName)
}

export function mapToInstructorOptionDtos(users: InstructorLeanUser[]): InstructorOptionDto[] {
  const visibleNames = users.map((user) => normalizeVisibleName(user.fullName))
  const nameCounts = new Map<string, number>()

  for (const name of visibleNames) {
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1)
  }

  return users.map((user) => {
    const fullName = normalizeVisibleName(user.fullName)
    const dto: InstructorOptionDto = {
      id: user._id.toString(),
      fullName,
    }

    if ((nameCounts.get(fullName) ?? 0) > 1) {
      dto.disambiguationLabel = user.email.trim()
    }

    return dto
  })
}

export function getInstructorOptionLabel(option: InstructorOptionDto): string {
  if (option.disambiguationLabel) {
    return `${option.fullName} (${option.disambiguationLabel})`
  }

  return option.fullName
}

export function assertInstructorOptionDtoSafety(dto: InstructorOptionDto): void {
  for (const key of Object.keys(dto)) {
    if (!INSTRUCTOR_OPTION_DTO_KEYS.includes(key as (typeof INSTRUCTOR_OPTION_DTO_KEYS)[number])) {
      throw new Error(`Unsafe instructor option DTO field: ${key}`)
    }
  }
}
