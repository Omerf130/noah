import Button from '../../../ui/Button/Button'
import { siteConfig } from '../../../../../lib/site'
import styles from './ContactDetails.module.scss'

export default function ContactDetails() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent('שלום, אשמח לקבל מידע.')}`

  return (
    <div className={styles.details}>
      <div className={styles.item}>
        <h3>טלפון</h3>
        <a href={`tel:${siteConfig.phoneTel}`}>{siteConfig.phoneDisplay}</a>
      </div>
      <div className={styles.item}>
        <h3>מייל</h3>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </div>
      <div className={styles.item}>
        <h3>וואטסאפ</h3>
        <Button href={whatsappUrl} variant="ghost" className={styles.whatsappBtn}>
          שליחת הודעה
        </Button>
      </div>
    </div>
  )
}
