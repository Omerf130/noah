import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from './page.module.scss'

export const metadata = buildPageMetadata({
  title: 'התחברות',
  description: 'האזור האישי ללמידה ייפתח עם השקת הקורס הדיגיטלי.',
  path: '/login',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'התחברות',
          description: 'האזור האישי ללמידה ייפתח עם השקת הקורס הדיגיטלי.',
          path: '/login',
        })}
      />
      <div className={styles.page} dir="rtl">
        <section className={styles.hero}>
          <Container>
            <span className={styles.eyebrow}>האזור האישי · בקרוב</span>
            <h1 className={styles.title}>כאן תוכלו ללמוד — בקרוב</h1>
            <p className={styles.subtitle}>
              האזור האישי ייפתח עם השקת הקורס הדיגיטלי. שם תוכלו לצפות בשיעורים,
              לעקוב אחר ההתקדמות ולגשת לחומרי הלמידה.
            </p>
            <div className={styles.actions}>
              <Button href="/courses/pharmaceutical-calculations" variant="primary">
                לפרטי הקורס
              </Button>
              <Button href="/contact" variant="ghost">
                צרו קשר
              </Button>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}
