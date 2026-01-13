import styles from './Testimonials.module.scss'

const Testimonials = () => {
  const testimonials = [
    'הרגשתי שיש לי סוף־סוף סדר ודרך.',
    'התחלתי לתרגל בצורה קבועה וברורה.',
    'הגעתי למבחנים רגועה יותר ועם יותר ביטחון.',
  ]

  return (
    <section className={styles.testimonialsWrapper}>
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.sectionTitle}>מה סטודנטים מספרים אחרי תהליך</h2>
        <p className={styles.subtitle}>תחושות שחוזרות</p>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>{testimonial}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

