import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { getAdminRichTextBlockEdit } from '../../../../../../../../../../../../../lib/courses/queries/admin-rich-text-block-edit-query'
import { buildPageMetadata } from '../../../../../../../../../../../../../lib/seo'
import { EditRichTextBlockForm } from '../../../../../../../../../../../../components/admin/courses/content-blocks/RichTextBlockForm/RichTextBlockForm'
import CourseAdminNav from '../../../../../../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import LessonAdminNav from '../../../../../../../../../../../../components/admin/courses/lessons/LessonAdminNav/LessonAdminNav'
import ModuleAdminNav from '../../../../../../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import Button from '../../../../../../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../../../../../../components/admin/courses/lessons/LessonContent.module.scss'

export const runtime = 'nodejs'

type AdminEditRichTextBlockPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string; blockId: string }>
}

export async function generateMetadata({ params }: AdminEditRichTextBlockPageProps) {
  const { courseId, moduleId, lessonId, blockId } = await params
  const blockEdit = await getAdminRichTextBlockEdit(courseId, moduleId, lessonId, blockId)

  if (!blockEdit) {
    return buildPageMetadata({
      title: 'בלוק לא נמצא',
      description: 'בלוק התוכן המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/${blockId}/edit`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `עריכת בלוק טקסט — ${blockEdit.lessonTitle}`,
    description: 'עריכת בלוק טקסט עשיר בשיעור.',
    path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/${blockId}/edit`,
    noIndex: true,
  })
}

export default async function AdminEditRichTextBlockPage({ params }: AdminEditRichTextBlockPageProps) {
  const { courseId, moduleId, lessonId, blockId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/${blockId}/edit`,
  })

  const [context, blockEdit] = await Promise.all([
    getAdminModuleLessonContext(courseId, moduleId),
    getAdminRichTextBlockEdit(courseId, moduleId, lessonId, blockId),
  ])

  if (!context || !blockEdit) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button
            href={`/admin/courses/${context.courseId}/content/${context.moduleId}/lessons/${blockEdit.lessonId}/content`}
            variant="ghost"
          >
            חזרה לתוכן השיעור
          </Button>
        </div>
        <p className={styles.context}>{context.courseTitle}</p>
        <h1 className={styles.title}>עריכת בלוק טקסט עשיר</h1>
        <p className={styles.lead}>{blockEdit.lessonTitle}</p>
      </header>

      <CourseAdminNav courseId={context.courseId} activeTab="content" />
      <ModuleAdminNav
        courseId={context.courseId}
        moduleId={context.moduleId}
        activeTab="lessons"
      />
      <LessonAdminNav
        courseId={context.courseId}
        moduleId={context.moduleId}
        lessonId={blockEdit.lessonId}
        activeTab="content"
      />

      <EditRichTextBlockForm
        courseId={blockEdit.courseId}
        moduleId={blockEdit.moduleId}
        lessonId={blockEdit.lessonId}
        blockId={blockEdit.blockId}
        documentJson={blockEdit.documentJson}
      />
    </div>
  )
}
