import Link from 'next/link'
import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import { practiceKitProduct } from '../../../../lib/content/products'
import { getContactHref } from '../../../../lib/contact'
import { buildPageMetadata, buildProductJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../lib/JsonLd'
import styles from '../../catalog-page.module.scss'
import detailStyles from './page.module.scss'

const product = practiceKitProduct

export const metadata = buildPageMetadata({
  title: product.seo.title,
  description: product.seo.description,
  path: product.path,
})

export default function PracticeKitProductPage() {
  return (
    <>
      <JsonLd
        data={buildProductJsonLd({
          title: product.seo.title,
          description: product.seo.description,
          path: product.path,
        })}
      />
      <div className={styles.page} dir="rtl">
        <PageHero
          variant="focus"
          eyebrow={product.hero.eyebrow}
          title={product.hero.title}
          subtitle={product.hero.subtitle}
          ctaHref={getContactHref(product.contactService)}
          ctaLabel="לפרטים על ערכת התרגול"
        />

        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>מה כוללת הערכה</h2>
            <div className={detailStyles.featureGrid}>
              {product.features.map((feature) => (
                <article key={feature.title} className={detailStyles.featureCard}>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>למי זה מתאים</h2>
            <p className={detailStyles.lead}>{product.audience}</p>
            <p className={detailStyles.lead}>
              משתלב עם{' '}
              <Link href={product.relatedCoursePath}>קורס החישוב הרוקחי</Link>.
            </p>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <Button href={getContactHref(product.contactService)} variant="primary">
              צרו קשר לגבי ערכת התרגול
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
