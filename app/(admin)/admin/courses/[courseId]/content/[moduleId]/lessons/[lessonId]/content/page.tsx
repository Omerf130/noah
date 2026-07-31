import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { listAdminLessonContentBlocks } from '../../../../../../../../../../lib/courses/queries/admin-lesson-content-query'
import { buildPageMetadata } from '../../../../../../../../../../lib/seo'
import ContentBlockList from '../../../../../../../../../components/admin/courses/content-blocks/ContentBlockList/ContentBlockList'
import CourseAdminNav from '../../../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import LessonAdminNav from '../../../../../../../../../components/admin/courses/lessons/LessonAdminNav/LessonAdminNav'
import ModuleAdminNav from '../../../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import Button from '../../../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../../../components/admin/courses/lessons/LessonContent.module.scss'

export const runtime = 'nodejs'

type AdminLessonContentPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

export async function generateMetadata({ params }: AdminLessonContentPageProps) {
  const { courseId, moduleId, lessonId } = await params
  const lessonContent = await listAdminLessonContentBlocks(courseId, moduleId, lessonId)

  if (!lessonContent) {
    return buildPageMetadata({
      title: 'שיעור לא נמצא',
      description: 'השיעור המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `תוכן השיעור — ${lessonContent.lessonTitle}`,
    description: `ניהול בלוקי תוכן בשיעור.`,
    path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`,
    noIndex: true,
  })
}

export default async function AdminLessonContentPage({ params }: AdminLessonContentPageProps) {
  const { courseId, moduleId, lessonId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/content`,
  })

  const [context, lessonContent] = await Promise.all([
    getAdminModuleLessonContext(courseId, moduleId),
    listAdminLessonContentBlocks(courseId, moduleId, lessonId),
  ])

  if (!context || !lessonContent) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button
            href={`/admin/courses/${context.courseId}/content/${context.moduleId}`}
            variant="ghost"
          >
            חזרה לשיעורי הפרק
          </Button>
        </div>
        <p className={styles.context}>{context.courseTitle}</p>
        <h1 className={styles.title}>תוכן השיעור</h1>
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

      <p className={styles.summary}>
        {lessonContent.totalItems === 0
          ? 'אין בלוקי תוכן בשיעור זה'
          : `מציג ${lessonContent.totalItems} בלוקי תוכן`}
      </p>

      <ContentBlockList
        courseId={context.courseId}
        moduleId={context.moduleId}
        lessonId={lessonContent.lessonId}
        items={lessonContent.items}
      />
    </div>
  )
}
