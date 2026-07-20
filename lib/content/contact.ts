export const contactServiceOptions = [
  { slug: 'pharmaceutical-calculations', label: 'קורס חישוב רוקחי' },
  { slug: 'private-lessons', label: 'שיעורים פרטיים' },
  { slug: 'personal-guidance', label: 'ליווי אישי' },
  { slug: 'booklet', label: 'חוברת — המלווה הקליני' },
  { slug: 'practice-kit', label: 'ערכת תרגול' },
  { slug: 'general', label: 'פנייה כללית' },
] as const

export type ContactServiceSlug = (typeof contactServiceOptions)[number]['slug']
