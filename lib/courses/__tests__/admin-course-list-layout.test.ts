import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ADMIN_COURSES_PAGE_PATH = join(
  process.cwd(),
  'app',
  '(admin)',
  'admin',
  'courses',
  'page.tsx',
)

describe('admin courses list layout', () => {
  it('uses CourseCardGrid and does not render legacy table or card list components', () => {
    const source = readFileSync(ADMIN_COURSES_PAGE_PATH, 'utf8')

    expect(source).toContain('CourseCardGrid')
    expect(source).not.toContain('CourseListTable')
    expect(source).not.toContain('CourseListCards')
  })
})
