import styles from './ComparisonSection.module.scss'

type ComparisonSectionProps = {
  guidanceTitle?: string
  lessonTitle?: string
  guidance: string[]
  lesson: string[]
}

export default function ComparisonSection({
  guidanceTitle = 'ליווי אישי',
  lessonTitle = 'שיעור פרטי',
  guidance,
  lesson,
}: ComparisonSectionProps) {
  return (
    <div className={styles.grid}>
      <article className={[styles.column, styles.guidance].join(' ')}>
        <h3>{guidanceTitle}</h3>
        <ul>
          {guidance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article className={[styles.column, styles.lesson].join(' ')}>
        <h3>{lessonTitle}</h3>
        <ul>
          {lesson.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  )
}
