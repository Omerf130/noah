import styles from './ValueCards.module.scss'

const ValueCards = () => {
  const values = [
    'סדר ולו״ז ריאלי מותאם אישית',
    'שיטת תרגול ברורה',
    'הכנה נכונה למבחנים',
    'חיזוק והעמקת הידע',
    'ביטחון בלמידה ובהתנהלות',
    'משמעת עצמית והתמדה',
  ]

  return (
    <section className={styles.valueCardsWrapper}>
      <div className={styles.valueCardsContainer}>
        <h2 className={styles.sectionTitle}>מה מחכה לכם בתהליך</h2>
        <div className={styles.cardsGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>✨</span>
              </div>
              <p className={styles.valueText}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValueCards

