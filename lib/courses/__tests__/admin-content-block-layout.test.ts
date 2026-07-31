import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin content block layout and accessibility', () => {
  it('guards content pages with requireAdmin and uses server queries', () => {
    const contentPageSource = readFileSync(
      join(
        ROOT,
        'app',
        '(admin)',
        'admin',
        'courses',
        '[courseId]',
        'content',
        '[moduleId]',
        'lessons',
        '[lessonId]',
        'content',
        'page.tsx',
      ),
      'utf8',
    )
    const createPageSource = readFileSync(
      join(
        ROOT,
        'app',
        '(admin)',
        'admin',
        'courses',
        '[courseId]',
        'content',
        '[moduleId]',
        'lessons',
        '[lessonId]',
        'content',
        'blocks',
        'new',
        'page.tsx',
      ),
      'utf8',
    )
    const editPageSource = readFileSync(
      join(
        ROOT,
        'app',
        '(admin)',
        'admin',
        'courses',
        '[courseId]',
        'content',
        '[moduleId]',
        'lessons',
        '[lessonId]',
        'content',
        'blocks',
        '[blockId]',
        'edit',
        'page.tsx',
      ),
      'utf8',
    )

    for (const source of [contentPageSource, createPageSource, editPageSource]) {
      expect(source).toContain('requireAdmin')
    }

    expect(contentPageSource).toContain('LessonAdminNav')
    expect(contentPageSource).toContain('ContentBlockList')
    expect(contentPageSource).toContain('listAdminLessonContentBlocks')
    expect(createPageSource).toContain('CreateRichTextBlockForm')
    expect(editPageSource).toContain('EditRichTextBlockForm')
  })

  it('includes accessible labels and disabled move states in row actions', () => {
    const rowActionsSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'ContentBlockRowActions',
        'ContentBlockRowActions.tsx',
      ),
      'utf8',
    )
    const editorSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'RichTextEditor',
        'RichTextEditor.tsx',
      ),
      'utf8',
    )
    const previewSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'RichTextPreview',
        'RichTextPreview.tsx',
      ),
      'utf8',
    )
    const formSource = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'RichTextBlockForm',
        'RichTextBlockForm.tsx',
      ),
      'utf8',
    )

    expect(rowActionsSource).toContain('aria-disabled="true"')
    expect(rowActionsSource).toContain('aria-busy')
    expect(rowActionsSource).toContain('aria-live="polite"')
    expect(rowActionsSource).toContain('ConfirmDialog')
    expect(rowActionsSource).toContain('מעדכן...')

    expect(editorSource).toContain('aria-pressed')
    expect(editorSource).toContain("'aria-label': 'עורך טקסט עשיר'")
    expect(editorSource).toContain('role="toolbar"')

    expect(previewSource).toContain('aria-label="תצוגה מקדימה של התוכן"')

    expect(formSource).toContain('aria-busy={isPending}')
    expect(formSource).toContain('disabled={isPending}')
    expect(formSource).toContain('role="alert"')
  })

  it('uses responsive overflow protection in content block styles', () => {
    const listStyles = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'ContentBlockList',
        'ContentBlockList.module.scss',
      ),
      'utf8',
    )
    const editorStyles = readFileSync(
      join(
        ROOT,
        'app',
        'components',
        'admin',
        'courses',
        'content-blocks',
        'RichTextEditor',
        'RichTextEditor.module.scss',
      ),
      'utf8',
    )

    expect(listStyles).toContain('overflow-x: hidden')
    expect(listStyles).toContain('min-width: 0')
    expect(editorStyles).toContain('overflow-wrap: anywhere')
    expect(editorStyles).toContain('flex-wrap: wrap')
  })
})
