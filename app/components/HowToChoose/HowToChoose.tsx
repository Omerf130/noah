import Link from 'next/link'
import styles from './HowToChoose.module.scss'

const HowToChoose = () => {
  const services = [
    {
      title: 'המלווה הקליני',
      description: 'למי שמחפש תהליך עצמאי',
      link: '/clinical',
    },
    {
      title: 'שיעור פרטי',
      description: 'למי שצריך חיזוק ממוקד',
      link: '/private-lessons',
    },
    {
      title: 'ליווי אישי',
      description: 'למי שרוצה מסגרת לאורך זמן',
      link: '/private-process',
    },
  ]

  return (
    <section className={styles.howToChooseWrapper}>
      <div className={styles.howToChooseContainer}>
        <h2 className={styles.sectionTitle}>איך לבחור מה מתאים לכם?</h2>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <Link href={service.link} className={styles.serviceBtn}>
                לקריאה נוספת
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowToChoose

