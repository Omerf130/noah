import styles from './PrivateProcess.module.scss'
import Link from 'next/link'

const PrivateProcess = () => {
  return (
    <section className={styles.privateWrapper} id="process">
      <div className={styles.privateContainer}>
        <h1 className={styles.privateHeader}>ליווי אישי לסטודנטים לסיעוד</h1>

        <p className={styles.privateContent}>
          הליווי האישי מיועד לסטודנטים שמבינים את החומר אבל מתקשים לשמור על
          שגרה לימודית והתמדה לאורך זמן. זהו תהליך מובנה שמטרתו לעזור לך:
          <br />✨ לנהל את הזמן בצורה יעילה יותר
          <br />✨ לפתח משמעת עצמית דרך תרגול רציף
          <br />✨ להתמודד עם נפילות בלי להישבר
          <br />✨ לחזק ביטחון ומסוגלות בלמידה ובשטח
          <br />
          <br />
          איך זה עובד?
          <br />✨ תהליך של 6 מפגשים אישיים
          <br />✨ מפגש שבועי קבוע
          <br />✨ בכל מפגש: ליווי + כלי פרקטי לשבוע הקרוב
          <br />
          הליווי מתאים למי שמחפש מסגרת תומכת, ברורה ומעשית - ללא פתרונות קסם.
        </p>

        <Link href="/private-process" className={styles.privateBtn}>
          לבדיקת התאמה
        </Link>
      </div>
    </section>
  );
};

export default PrivateProcess;

