import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../lib/auth/current-user'
import { getAdminModuleLessonContext } from '../../../../../../../lib/courses/queries/admin-module-lesson-context-query'
import { listAdminModuleLessons } from '../../../../../../../lib/courses/queries/admin-lesson-list-query'
import { listAdminCourseModules } from '../../../../../../../lib/courses/queries/admin-module-list-query'
import { buildPageMetadata } from '../../../../../../../lib/seo'
import CourseAdminNav from '../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import ModuleAdminNav from '../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import LessonList from '../../../../../../components/admin/courses/lessons/LessonList/LessonList'
import Button from '../../../../../../components/ui/Button/Button'
import styles from '../../../../../../components/admin/courses/lessons/LessonContent.module.scss'

export const runtime = 'nodejs'

type AdminModuleLessonsPageProps = {
  params: Promise<{ courseId: string; moduleId: string }>
}

export async function generateMetadata({ params }: AdminModuleLessonsPageProps) {
  const { courseId, moduleId } = await params
  const context = await getAdminModuleLessonContext(courseId, moduleId)

  if (!context) {
    return buildPageMetadata({
      title: 'פרק לא נמצא',
      description: 'הפרק המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `שיעורי הפרק — ${context.moduleTitle}`,
    description: `ניהול שיעורים בפרק ${context.moduleTitle}.`,
    path: `/admin/courses/${context.courseId}/content/${context.moduleId}`,
    noIndex: true,
  })
}

export default async function AdminModuleLessonsPage({ params }: AdminModuleLessonsPageProps) {
  const { courseId, moduleId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}`,
  })

  const [context, lessonList, moduleList] = await Promise.all([
    getAdminModuleLessonContext(courseId, moduleId),
    listAdminModuleLessons(courseId, moduleId),
    listAdminCourseModules(courseId),
  ])

  if (!context || !lessonList || !moduleList) {
    notFound()
  }

  const siblingModules = moduleList.items
    .filter((courseModule) => courseModule.id !== context.moduleId)
    .map((courseModule) => ({
      id: courseModule.id,
      title: courseModule.title,
    }))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href={`/admin/courses/${context.courseId}/content`} variant="ghost">
            חזרה לפרקי הקורס
          </Button>
        </div>
        <p className={styles.context}>{context.courseTitle}</p>
        <h1 className={styles.title}>שיעורי הפרק</h1>
        <p className={styles.lead}>{context.moduleTitle}</p>
      </header>

      <CourseAdminNav courseId={context.courseId} activeTab="content" />
      <ModuleAdminNav
        courseId={context.courseId}
        moduleId={context.moduleId}
        activeTab="lessons"
      />

      <div className={styles.headerActions}>
        <Button
          href={`/admin/courses/${context.courseId}/content/${context.moduleId}/lessons/new`}
          variant="primary"
        >
          יצירת שיעור חדש
        </Button>
      </div>

      <p className={styles.summary}>
        {lessonList.totalItems === 0
          ? 'אין שיעורים בפרק זה'
          : `מציג ${lessonList.totalItems} שיעורים`}
      </p>

      <LessonList
        courseId={context.courseId}
        moduleId={context.moduleId}
        items={lessonList.items}
        siblingModules={siblingModules}
      />
    </div>
  )
}
