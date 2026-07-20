import styles from './PrivateLessons.module.scss'
import Link from 'next/link'

const PrivateLessons = () => {
  return (
    <section className={styles.lessonsWrapper} id="lessons">
      <div className={styles.lessonsContainer}>
        <h2 className={styles.lessonsHeader}>שיעורים פרטיים בסיעוד</h2>

        <p className={styles.lessonsContent}>
          השיעורים הפרטיים מיועדים לסטודנטים שזקוקים לעזרה ממוקדת לקראת מבחן,
          הבנת נושא מסוים או חיזוק חשיבה קלינית.
          <br /> במהלך השיעור: 
          <br />✨ נחדד מושגים בצורה ברורה
          <br />✨ נתרגל יחד – ולא רק "נעבור על החומר"
          <br />✨ נתאים את ההסבר לאופן הלמידה שלך
          <br />
          <br />
          המטרה היא לא רק להבין את החומר, אלא לצאת עם ביטחון וכלים להמשך
          למידה עצמאית.
        </p>

        <Link href="/private-lessons" className={styles.lessonsBtn}>
          לתיאום שיעור פרטי
        </Link>
      </div>
    </section>
  );
};

export default PrivateLessons;

