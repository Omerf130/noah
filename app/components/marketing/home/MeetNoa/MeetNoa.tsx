import Image from 'next/image'
import Container from '../../../ui/Container/Container'
import Button from '../../../ui/Button/Button'
import { homepageAboutNoa } from '../../../../../lib/content/homepage'
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
            <h2 className={styles.title}>{homepageAboutNoa.title}</h2>
            {homepageAboutNoa.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.text}>
                {paragraph}
              </p>
            ))}
            <div className={styles.actions}>
              <Button href={homepageAboutNoa.buttonHref} variant="primary">
                {homepageAboutNoa.buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
