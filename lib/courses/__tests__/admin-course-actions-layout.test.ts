import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin course archive/delete layout', () => {
  it('includes archive and delete actions on cards and details', () => {
    const cardSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'CourseCard.tsx'),
      'utf8',
    )
    const detailsSource = readFileSync(
      join(ROOT, 'app', '(admin)', 'admin', 'courses', '[courseId]', 'page.tsx'),
      'utf8',
    )
    const actionsSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'CourseActions', 'CourseActions.tsx'),
      'utf8',
    )

    expect(cardSource).toContain('CourseActions')
    expect(detailsSource).toContain('CourseActions')
    expect(actionsSource).toContain('ArchiveButton')
    expect(actionsSource).toContain('DeleteButton')

    const archiveSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'ArchiveButton', 'ArchiveButton.tsx'),
      'utf8',
    )
    const deleteSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'DeleteButton', 'DeleteButton.tsx'),
      'utf8',
    )

    expect(archiveSource).toContain('העברה לארכיון')
    expect(deleteSource).toContain('מחיקה לצמיתות')
  })

  it('uses the composed ConfirmDialog building blocks', () => {
    const archiveSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'ArchiveButton', 'ArchiveButton.tsx'),
      'utf8',
    )
    const deleteSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'DeleteButton', 'DeleteButton.tsx'),
      'utf8',
    )
    const dialogSource = readFileSync(
      join(ROOT, 'app', 'components', 'ui', 'ConfirmDialog', 'ConfirmDialog.tsx'),
      'utf8',
    )

    expect(archiveSource).toContain('ConfirmDialog')
    expect(deleteSource).toContain('ConfirmDialog')
    expect(dialogSource).toContain('showModal')
    expect(dialogSource).toContain('role="dialog"')
  })
})
