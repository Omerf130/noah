import { notFound } from 'next/navigation'
import { requireAdmin } from '../../../../../../../../lib/auth/current-user'
import { getAdminCourseContentContext } from '../../../../../../../../lib/courses/queries/admin-course-content-context-query'
import { getAdminModuleEdit } from '../../../../../../../../lib/courses/queries/admin-module-edit-query'
import { buildPageMetadata } from '../../../../../../../../lib/seo'
import CourseAdminNav from '../../../../../../../components/admin/courses/CourseAdminNav/CourseAdminNav'
import ModuleAdminNav from '../../../../../../../components/admin/courses/ModuleAdminNav/ModuleAdminNav'
import EditModuleForm from '../../../../../../../components/admin/courses/modules/EditModuleForm/EditModuleForm'
import Button from '../../../../../../../components/ui/Button/Button'
import styles from '../../../../../../../components/admin/courses/CreateCourseForm/CreateCourseForm.module.scss'

export const runtime = 'nodejs'

type AdminEditModulePageProps = {
  params: Promise<{ courseId: string; moduleId: string }>
}

export async function generateMetadata({ params }: AdminEditModulePageProps) {
  const { courseId, moduleId } = await params
  const moduleEdit = await getAdminModuleEdit(courseId, moduleId)

  if (!moduleEdit) {
    return buildPageMetadata({
      title: 'פרק לא נמצא',
      description: 'הפרק המבוקש לא נמצא.',
      path: `/admin/courses/${courseId}/content/${moduleId}/edit`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `עריכת פרק — ${moduleEdit.title}`,
    description: `עריכת פרק בקורס.`,
    path: `/admin/courses/${courseId}/content/${moduleId}/edit`,
    noIndex: true,
  })
}

export default async function AdminEditModulePage({ params }: AdminEditModulePageProps) {
  const { courseId, moduleId } = await params
  await requireAdmin({
    returnTo: `/admin/courses/${courseId}/content/${moduleId}/edit`,
  })

  const [course, moduleEdit] = await Promise.all([
    getAdminCourseContentContext(courseId),
    getAdminModuleEdit(courseId, moduleId),
  ])

  if (!course || !moduleEdit) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.backLink}>
          <Button href={`/admin/courses/${course.id}/content`} variant="ghost">
            חזרה לפרקי הקורס
          </Button>
        </div>
        <h1 className={styles.title}>עריכת פרק</h1>
        <p className={styles.lead}>{moduleEdit.title}</p>
      </header>

      <CourseAdminNav courseId={course.id} activeTab="content" />
      <ModuleAdminNav courseId={course.id} moduleId={moduleId} activeTab="details" />

      <EditModuleForm module={moduleEdit} />
    </div>
  )
}
