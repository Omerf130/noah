import styles from './PrivateProcess.module.scss'
import Link from 'next/link'

const PrivateProcess = () => {
  return (
    <section className={styles.privateWrapper} id="process">
      <div className={styles.privateContainer}>
        <h2 className={styles.privateHeader}>ליווי אישי לסטודנטים לסיעוד</h2>

        <div className={styles.privateContent}>
          <p>
            הליווי האישי מיועד לסטודנטים שמבינים את החומר אבל מתקשים לשמור על שגרה לימודית והתמדה לאורך זמן.
            זהו תהליך מובנה שמטרתו לעזור לך:
          </p>
          <ul className={styles.bulletList}>
            <li>✨ לנהל את הזמן בצורה יעילה יותר</li>
            <li>✨ לפתח משמעת עצמית דרך תרגול רציף</li>
            <li>✨ להתמודד עם נפילות בלי להישבר</li>
            <li>✨ לחזק ביטחון ומסוגלות בלמידה ובשטח</li>
          </ul>
          <p className={styles.subheading}>איך זה עובד?</p>
          <ul className={styles.bulletList}>
            <li>✨ תהליך של 6 מפגשים אישיים</li>
            <li>✨ מפגש שבועי קבוע</li>
            <li>✨ בכל מפגש: ליווי + כלי פרקטי לשבוע הקרוב</li>
          </ul>
          <p>
            הליווי מתאים למי שמחפש מסגרת תומכת, ברורה ומעשית ונועד לעזור לכם להמשיך גם כשקשה.
          </p>
        </div>

        <Link href="/private-process" className={styles.privateBtn}>
          לבירור התאמה
        </Link>
      </div>
    </section>
  );
};

export default PrivateProcess;

