import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin lesson row actions layout', () => {
  it('includes edit, move, move-to-module, and delete actions with conditional controls', () => {
    const actionsSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'lessons',
        'LessonRowActions',
        'LessonRowActions.tsx',
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
        'lessons',
        'LessonList',
        'LessonRow.tsx',
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
        'lessons',
        'LessonList',
        'LessonList.tsx',
      ),
      'utf8',
    )
    const modalSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'lessons',
        'MoveLessonToModuleModal',
        'MoveLessonToModuleModal.tsx',
      ),
      'utf8',
    )
    const pageSource = readFileSync(
      join(
        ROOT,
        'app',
        '(admin)',
        'admin',
        'courses',
        '[courseId]',
        'content',
        '[moduleId]',
        'page.tsx',
      ),
      'utf8',
    )

    expect(actionsSource).toContain('LessonRowActions')
    expect(actionsSource).toContain('variant="ghost"')
    expect(actionsSource).toContain('העבר למעלה')
    expect(actionsSource).toContain('העבר למטה')
    expect(actionsSource).toContain('העבר לפרק אחר')
    expect(actionsSource).toContain('מחיקת שיעור')
    expect(actionsSource).toContain('canMoveUp')
    expect(actionsSource).toContain('canMoveDown')
    expect(actionsSource).toContain('canMoveToModule')
    expect(actionsSource).toContain('siblingModules.length > 0')
    expect(actionsSource).toContain('ConfirmDialog')
    expect(actionsSource).toContain('MoveLessonToModuleModal')

    expect(rowSource).toContain('LessonRowActions')
    expect(rowSource).toContain('position={position}')
    expect(rowSource).toContain('totalItems={totalItems}')
    expect(rowSource).toContain('siblingModules={siblingModules}')

    expect(listSource).toContain('siblingModules')
    expect(listSource).toContain('position={index + 1}')
    expect(listSource).toContain('totalItems={items.length}')

    expect(modalSource).toContain('ConfirmDialog')
    expect(modalSource).toContain('confirmDisabled')

    expect(pageSource).toContain('listAdminCourseModules')
    expect(pageSource).toContain('siblingModules')
  })
})
