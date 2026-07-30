import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { getAdminLessonEdit } from '../../../../../../../../../../lib/courses/queries/admin-lesson-edit-query'
import { buildPageMetadata } from '../../../../../../../../../../lib/seo'
import CourseAdminNav from '../../../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import ModuleAdminNav from '../../../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import EditLessonForm from '../../../../../../../../../components/admin/courses/lessons/EditLessonForm/EditLessonForm'
import Button from '../../../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

type AdminEditLessonPageProps = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

export async function generateMetadata({ params }: AdminEditLessonPageProps) {
  const { courseId, moduleId, lessonId } = await params
  const lessonEdit = await getAdminLessonEdit(courseId, moduleId, lessonId)

  if (!lessonEdit) {
    return buildPageMetadata({
      title: 'שיעור לא נמצא',
      description: 'השיעור המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/edit`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `עריכת שיעור — ${lessonEdit.title}`,
    description: `עריכת שיעור בפרק.`,
    path: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/edit`,
    noIndex: true,
  })
}

export default async function AdminEditLessonPage({ params }: AdminEditLessonPageProps) {
  const { courseId, moduleId, lessonId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/lessons/${lessonId}/edit`,
  })

  const [context, lessonEdit] = await Promise.all([
    getAdminModuleLessonContext(courseId, moduleId),
    getAdminLessonEdit(courseId, moduleId, lessonId),
  ])

  if (!context || !lessonEdit) {
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
        <h1 className={styles.title}>עריכת שיעור</h1>
        <p className={styles.lead}>{lessonEdit.title}</p>
      </header>

      <CourseAdminNav courseId={context.courseId} activeTab="content" />
      <ModuleAdminNav
        courseId={context.courseId}
        moduleId={context.moduleId}
        activeTab="lessons"
      />

      <EditLessonForm lesson={lessonEdit} />
    </div>
  )
}
