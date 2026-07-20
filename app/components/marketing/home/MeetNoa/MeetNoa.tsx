import Image from 'next/image'
import Link from 'next/link'
import Container from '../../../ui/Container/Container'
import Button from '../../../ui/Button/Button'
import styles from './MeetNoa.module.scss'

export default function MeetNoa() {
  return (
    <section className={styles.wrapper} id="about">
      <Container>
        <div className={styles.grid}>
          <div className={styles.portrait}>
            <div className={styles.frame}>
              <Image
                src="/pics/noa.jpeg"
                alt="נועה — אחות מוסמכת ומלווה סטודנטים לסיעוד"
                width={400}
                height={480}
                className={styles.photo}
              />
            </div>
            <div className={styles.accentBlob} aria-hidden="true" />
          </div>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>נעים להכיר</span>
            <h2 className={styles.title}>אני נועה — ואני כאן בשבילכם</h2>
            <p className={styles.text}>
              אחות מוסמכת, בוגרת תואר ראשון בסיעוד וסטודנטית לתואר שני. לאורך הדרך הבנתי
              שהקושי האמיתי הוא לא רק החומר — אלא שגרה, התמדה וביטחון.
            </p>
            <ul className={styles.credentials}>
              <li>ליווי אישי · 6 מפגשים מובנים</li>
              <li>שיעורים פרטיים בזום</li>
              <li>המלווה הקליני — חוברת תהליכים</li>
            </ul>
            <div className={styles.actions}>
              <Button href="/about" variant="primary">
                עוד עליי
              </Button>
              <Link href="/#contact" className={styles.link}>
                בואו נדבר
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
