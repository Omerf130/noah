import styles from './Clinical.module.scss'
import Image from 'next/image'
import Link from 'next/link'

const Clinical = () => {
  return (
    <section className={styles.clinicalWrapper} id="clinical">
      <div className={styles.clinicalContainer}>

        <div className={styles.clinicalImage}>
          <Image 
            src="/pics/clinical.jpeg" 
            alt="clinical guide" 
            width={340}
            height={430}
            style={{ borderRadius: '22px' }}
          />
        </div>

        <div className={styles.clinicalContent}>
          <h1 className={styles.clinicalTitle}>
            המלווה הקליני – חוברת תהליכים לסטודנטים לסיעוד
          </h1>

          <p className={styles.clinicalText}>
            המלווה הקליני היא חוברת עבודה אישית שנועדה ללוות אתכם לאורך הדרך – בקצב שלכם.
            <br /> החוברת משלבת:
            <br />✨ רפלקציה ועיבוד חוויות
            <br />✨ הצבת מטרות ומעקב אחר התקדמות
            <br />✨ כלים ללמידה, יציאה לשטח ולתקופות מבחנים
            <br />✨ חיזוק פנימי ובניית זהות מקצועית
            <br /><br />
            זהו תהליך עצמאי, שלא מחייב ליווי אישי ומתאים לסטודנטים שרוצים לעצור רגע,
            לעשות סדר ולחזק את עצמם תוך כדי התואר.
          </p>

          <Link href="/clinical" className={styles.clinicalBtn}>
            לקריאה על החוברת
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Clinical;

