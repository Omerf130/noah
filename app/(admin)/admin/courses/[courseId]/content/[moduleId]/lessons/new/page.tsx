import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { buildPageMetadata } from '../../../../../../../../../lib/seo'
import CourseAdminNav from '../../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import ModuleAdminNav from '../../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import CreateLessonForm from '../../../../../../../../components/admin/courses/lessons/CreateLessonForm/CreateLessonForm'
import Button from '../../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

type AdminCreateLessonPageProps = {
  params: Promise<{ courseId: string; moduleId: string }>
}

export async function generateMetadata({ params }: AdminCreateLessonPageProps) {
  const { courseId, moduleId } = await params
  const context = await getAdminModuleLessonContext(courseId, moduleId)

  if (!context) {
    return buildPageMetadata({
      title: 'פרק לא נמצא',
      description: 'הפרק המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/lessons/new`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `יצירת שיעור — ${context.moduleTitle}`,
    description: `יצירת שיעור חדש בפרק ${context.moduleTitle}.`,
    path: `/admin/courses/${context.courseId}/content/${context.moduleId}/lessons/new`,
    noIndex: true,
  })
}

export default async function AdminCreateLessonPage({ params }: AdminCreateLessonPageProps) {
  const { courseId, moduleId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/lessons/new`,
  })

  const context = await getAdminModuleLessonContext(courseId, moduleId)

  if (!context) {
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
        <h1 className={styles.title}>יצירת שיעור חדש</h1>
        <p className={styles.lead}>{context.moduleTitle}</p>
      </header>

      <CourseAdminNav courseId={context.courseId} activeTab="content" />
      <ModuleAdminNav
        courseId={context.courseId}
        moduleId={context.moduleId}
        activeTab="lessons"
      />

      <CreateLessonForm courseId={context.courseId} moduleId={context.moduleId} />
    </div>
  )
}
