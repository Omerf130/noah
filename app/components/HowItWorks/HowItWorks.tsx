import styles from './HowItWorks.module.scss'

const HowItWorks = () => {
  return (
    <section className={styles.howItWorksWrapper} id="how-it-works">
      <div className={styles.howItWorksContainer}>
        <h2 className={styles.sectionTitle}>איך זה עובד</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepText}>
              <strong>מבינים מה אתם צריכים</strong>
              <br />קוראים על השירותים ועוצרים רגע לראות מה מרגיש לכם נכון.
            </div>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepText}>
              <strong>פונים להתייעצות</strong>
              <br />שיחה קצרה כדי לדייק את הצורך שלכם.
            </div>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepText}>
              <strong>יוצאים לדרך מסודרת</strong>
              <br />עם שיטה, תרגול וכלים שמתאימים לכם.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

