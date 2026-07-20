export const siteConfig = {
  name: 'נוח',
  title: 'נוח - ליווי סטודנטים לסיעוד',
  description: 'ליווי אישי, שיעורים פרטיים והמלווה הקליני לסטודנטים לסיעוד',
  locale: 'he_IL',
  phone: '972543050482',
  // TODO(JSON-LD): Add canonical site URL when confirmed for production
  // TODO(JSON-LD): Add social profile URLs when confirmed
  // TODO(JSON-LD): Add business address when confirmed
} as const

export const marketingRoutes = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/clinical', priority: 0.9 },
  { path: '/private-lessons', priority: 0.9 },
  { path: '/private-process', priority: 0.9 },
] as const
