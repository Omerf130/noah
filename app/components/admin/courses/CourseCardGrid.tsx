import type { AdminCourseListItemDto } from '../../../../lib/courses/mappers/to-admin-course-list-dto'
import CourseCard from './CourseCard'
import styles from './CourseList.module.scss'

type CourseCardGridProps = {
  items: AdminCourseListItemDto[]
}

export default function CourseCardGrid({ items }: CourseCardGridProps) {
  return (
    <div className={styles.cardGridLayout}>
      {items.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
