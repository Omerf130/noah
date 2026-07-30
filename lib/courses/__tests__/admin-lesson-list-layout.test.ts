import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('admin lesson list layout', () => {
  it('includes module and lesson nav, list page, and ניהול שיעורים entry', () => {
    const moduleNavSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'ModuleAdminNav', 'ModuleAdminNav.tsx'),
      'utf8',
    )
    const lessonPageSource = readFileSync(
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
    const moduleEditSource = readFileSync(
      join(
        ROOT,
        'app',
        '(admin)',
        'admin',
        'courses',
        '[courseId]',
        'content',
        '[moduleId]',
        'edit',
        'page.tsx',
      ),
      'utf8',
    )
    const lessonRowSource = readFileSync(
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
    const lessonListSource = readFileSync(
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
    const moduleRowActionsSource = readFileSync(
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
    const stylesSource = readFileSync(
      join(ROOT, 'app', 'components', 'admin', 'courses', 'lessons', 'LessonContent.module.scss'),
      'utf8',
    )

    expect(moduleNavSource).toContain('פרטי הפרק')
    expect(moduleNavSource).toContain('שיעורים')
    expect(moduleNavSource).toContain('/content/${moduleId}/edit')
    expect(moduleNavSource).toContain('/content/${moduleId}`')

    expect(lessonPageSource).toContain('CourseAdminNav')
    expect(lessonPageSource).toContain('ModuleAdminNav')
    expect(lessonPageSource).toContain('LessonList')
    expect(lessonPageSource).toContain('requireAdmin')
    expect(lessonPageSource).toContain('listAdminModuleLessons')
    expect(lessonPageSource).toContain('יצירת שיעור חדש')
    expect(lessonPageSource).toContain('headerActions')

    expect(moduleEditSource).toContain('ModuleAdminNav')
    expect(moduleEditSource).toContain("activeTab=\"details\"")

    expect(lessonRowSource).toContain('LessonPublicationBadge')
    expect(lessonRowSource).toContain('בלוקי תוכן')
    expect(lessonRowSource).toContain('LessonRowActions')
    expect(lessonRowSource).not.toContain('variant="ghost"')
    expect(lessonRowSource).not.toContain('העבר')
    expect(lessonRowSource).not.toContain('מחיק')

    expect(lessonListSource).toContain('אין שיעורים עדיין')
    expect(lessonListSource).toContain('courseId={courseId}')
    expect(lessonListSource).toContain('moduleId={moduleId}')
    expect(lessonListSource).toContain('siblingModules')

    expect(moduleRowActionsSource).toContain('ניהול שיעורים')
    expect(moduleRowActionsSource).toContain('variant="primary"')
    expect(moduleRowActionsSource).toContain('/admin/courses/${courseId}/content/${moduleId}`')

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
    expect(moduleRowSource).toContain('courseId={courseId}')
    expect(moduleRowSource).toContain('moduleId={module.id}')

    expect(stylesSource).toContain('overflow-x: hidden')
    expect(stylesSource).toContain('headerActions')
    expect(stylesSource).toContain('lessonRowActions')
  })

  it('includes F2 create and edit lesson pages', () => {
    const createLessonPageSource = readFileSync(
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
        'new',
        'page.tsx',
      ),
      'utf8',
    )
    const editLessonPageSource = readFileSync(
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
        'edit',
        'page.tsx',
      ),
      'utf8',
    )

    expect(createLessonPageSource).toContain('CreateLessonForm')
    expect(createLessonPageSource).toContain('יצירת שיעור חדש')
    expect(createLessonPageSource).toContain('getAdminModuleLessonContext')

    expect(editLessonPageSource).toContain('EditLessonForm')
    expect(editLessonPageSource).toContain('עריכת שיעור')
    expect(editLessonPageSource).toContain('getAdminLessonEdit')
  })
})
