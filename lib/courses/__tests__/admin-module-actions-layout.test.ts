import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin module row actions layout', () => {
  it('includes edit, move, delete actions with conditional move controls', () => {
    const actionsSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'modules',
        'ModuleRowActions',
        'ModuleRowActions.tsx',
      ),
      'utf8',
    )
    const rowSource = readFileSync(
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
    const listSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'modules',
        'ModuleList',
        'ModuleList.tsx',
      ),
      'utf8',
    )
    const stylesSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'modules', 'ModuleContent.module.scss'),
      'utf8',
    )

    expect(rowSource).toContain('ModuleRowActions')
    expect(rowSource).toContain('courseId={courseId}')
    expect(rowSource).toContain('moduleId={module.id}')
    expect(rowSource).not.toContain('עריכה')
    expect(actionsSource).toContain('ניהול שיעורים')
    expect(actionsSource).toContain('variant="primary"')
    expect(actionsSource).toContain('/admin/courses/${courseId}/content/${moduleId}`')
    expect(actionsSource).toContain('עריכה')
    expect(actionsSource).toContain('העבר למעלה')
    expect(actionsSource).toContain('העבר למטה')
    expect(actionsSource).toContain('מחיקת פרק')
    expect(actionsSource).toContain('ConfirmDialog')
    expect(actionsSource).toContain('totalItems > 1')
    expect(actionsSource).toContain('position > 1')
    expect(actionsSource).toContain('position < totalItems')
    expect(listSource).toContain('totalItems={items.length}')
    expect(stylesSource).toContain('overflow-x: hidden')
  })
})
