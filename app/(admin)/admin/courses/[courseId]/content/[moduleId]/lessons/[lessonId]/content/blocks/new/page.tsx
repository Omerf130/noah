import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { listAdminLessonContentBlocks } from '../../../../../../../../../../../../lib/courses/queries/admin-lesson-content-query'
import { mapToAdminRichTextBlockCreateContext } from '../../../../../../../../../../../../lib/courses/mappers/to-admin-rich-text-block-edit-dto'
import { buildPageMetadata } from '../../../../../../../../../../../../lib/seo'
import { CreateRichTextBlockForm } from '../../../../../../../../../../../components/admin/courses/content-blocks/RichTextBlockForm/RichTextBlockForm'
import CourseAdminNav from '../../../../../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import LessonAdminNav from '../../../../../../../../../../../components/admin/courses/lessons/LessonAdminNav/LessonAdminNav'
import ModuleAdminNav from '../../../../../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import Button from '../../../../../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../../../../../components/admin/courses/lessons/LessonContent.module.scss'

export const runtime = 'nodejs'

type AdminCreateRichTextBlockPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

export async function generateMetadata({ params }: AdminCreateRichTextBlockPageProps) {
  const { courseId, moduleId, lessonId } = await params
  const lessonContent = await listAdminLessonContentBlocks(courseId, moduleId, lessonId)

  if (!lessonContent) {
    return buildPageMetadata({
      title: 'שיעור לא נמצא',
      description: 'השיעור המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/new`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `יצירת בלוק טקסט — ${lessonContent.lessonTitle}`,
    description: 'יצירת בלוק טקסט עשיר בשיעור.',
    path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/new`,
    noIndex: true,
  })
}

export default async function AdminCreateRichTextBlockPage({
  params,
}: AdminCreateRichTextBlockPageProps) {
  const { courseId, moduleId, lessonId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content/blocks/new`,
  })

  const [context, lessonContent] = await Promise.all([
    getAdminModuleLessonContext(courseId, moduleId),
    listAdminLessonContentBlocks(courseId, moduleId, lessonId),
  ])

  if (!context || !lessonContent) {
    notFound()
  }

  const createContext = mapToAdminRichTextBlockCreateContext({
    courseId: lessonContent.courseId,
    moduleId: lessonContent.moduleId,
    lessonId: lessonContent.lessonId,
    lessonTitle: lessonContent.lessonTitle,
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button
            href={`/admin/courses/${context.courseId}/content/${context.moduleId}/lessons/${lessonContent.lessonId}/content`}
            variant="ghost"
          >
            חזרה לתוכן השיעור
          </Button>
        </div>
        <p className={styles.context}>{context.courseTitle}</p>
        <h1 className={styles.title}>יצירת בלוק טקסט עשיר</h1>
        <p className={styles.lead}>{lessonContent.lessonTitle}</p>
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
        lessonId={lessonContent.lessonId}
        activeTab="content"
      />

      <CreateRichTextBlockForm
        courseId={createContext.courseId}
        moduleId={createContext.moduleId}
        lessonId={createContext.lessonId}
        documentJson={createContext.documentJson}
      />
    </div>
  )
}
