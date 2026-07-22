import { homepageTestimonials } from '../../../lib/content/homepage'
import styles from './Testimonials.module.scss'

type TestimonialsProps = {
  title?: string
}

const Testimonials = ({ title }: TestimonialsProps) => {
  const changes = [
    'עזרה בארגון הלמידה',
    'חיזוק ביטחון בהתמודדות עם חומר',
    'הפחתת תחושת לחץ',
    'תחושה שיש דרך משמעותית',
  ]

  return (
    <section className={styles.testimonialsWrapper}>
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.sectionTitle}>{title ?? homepageTestimonials.title}</h2>
        <div className={styles.changesGrid}>
          {changes.map((change, index) => (
            <div key={index} className={styles.changeCard}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>✓</span>
              </div>
              <p className={styles.changeText}>{change}</p>
            </div>
          ))}
        </div>
        <p className={styles.bottomLine}>
          כל אחד עובר את זה בקצב שלו, אבל הרבה חוויות חוזרות על עצמן.
        </p>
      </div>
    </section>
  )
}

export default Testimonials
