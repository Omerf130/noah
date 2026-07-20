export const siteConfig = {
  name: 'נוח',
  title: 'נוח - ליווי סטודנטים לסיעוד',
  description: 'ליווי אישי, שיעורים פרטיים, קורסים ומוצרים לסטודנטים לסיעוד',
  locale: 'he_IL',
  phoneDisplay: '0543050482',
  phoneTel: '0543050482',
  email: 'noarakhlin0410@gmail.com',
  whatsappNumber: '972543050482',
} as const

export const marketingRoutes = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/courses', priority: 0.9 },
  { path: '/courses/pharmaceutical-calculations', priority: 0.85 },
  { path: '/products', priority: 0.9 },
  { path: '/products/booklet', priority: 0.85 },
  { path: '/products/practice-kit', priority: 0.85 },
  { path: '/personal-guidance', priority: 0.9 },
  { path: '/private-lessons', priority: 0.9 },
  { path: '/contact', priority: 0.95 },
  { path: '/login', priority: 0.5 },
] as const

export function getSiteUrl(path = ''): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
  if (!path || path === '/') {
    return base || '/'
  }
  return base ? `${base}${path.startsWith('/') ? path : `/${path}`}` : path
}
