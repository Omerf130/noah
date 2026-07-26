import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin course content layout', () => {
  it('includes course admin nav with פרקי הקורס and content route', () => {
    const navSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'CourseAdminNav', 'CourseAdminNav.tsx'),
      'utf8',
    )
    const detailsSource = readFileSync(
      join(ROOT, 'app', '(admin)', 'admin', 'courses', '[courseId]', 'page.tsx'),
      'utf8',
    )
    const contentSource = readFileSync(
      join(ROOT, 'app', '(admin)', 'admin', 'courses', '[courseId]', 'content', 'page.tsx'),
      'utf8',
    )
    const moduleRowSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'modules',
        'ModuleList',
        'ModuleRow.tsx',
      ),
      'utf8',
    )

    expect(navSource).toContain('פרקי הקורס')
    expect(navSource).toContain('פרטי הקורס')
    expect(navSource).toContain('/content')
    expect(detailsSource).toContain('CourseAdminNav')
    expect(detailsSource).toContain('ניהול פרקי הקורס')
    expect(contentSource).toContain('CourseAdminNav')
    expect(contentSource).toContain('ModuleList')
    expect(contentSource).toContain('יצירת פרק חדש')
    expect(moduleRowSource).toContain('ModuleRowActions')
  })
})
