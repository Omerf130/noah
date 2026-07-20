import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import BookFrame from '../../../components/marketing/BookFrame/BookFrame'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import { bookletProduct } from '../../../../lib/content/products'
import { getContactHref } from '../../../../lib/contact'
import { buildPageMetadata, buildProductJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../lib/JsonLd'
import styles from '../../clinical/page.module.scss'

const product = bookletProduct

export const metadata = buildPageMetadata({
  title: product.seo.title,
  description: product.seo.description,
  path: product.path,
})

export default function BookletProductPage() {
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
          variant="product"
          eyebrow={product.hero.eyebrow}
          title={product.hero.title}
          subtitle={product.hero.subtitle}
          ctaHref={getContactHref(product.contactService)}
          ctaLabel="לפרטים על החוברת"
          visual={
            <BookFrame src={product.image.src} alt={product.image.alt} priority />
          }
        />

        <section className={styles.bentoSection}>
          <Container>
            <h2 className={styles.sectionTitle}>מה תמצאו בפנים</h2>
            <div className={styles.bento}>
              {product.features.map((f, i) => (
                <article key={f.title} className={[styles.tile, styles[`t${(i % 3) + 1}`]].join(' ')}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.splitSection}>
          <Container>
            <div className={styles.split}>
              <BookFrame src={product.secondaryImage.src} alt={product.secondaryImage.alt} />
              <div>
                <h2>למי זה מתאים?</h2>
                <p>{product.audience}</p>
                <p className={styles.note}>{product.note}</p>
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <Button href={getContactHref(product.contactService)} variant="primary">
              צרו קשר לגבי החוברת
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
