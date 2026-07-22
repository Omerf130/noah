import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import BookFrame from '../../../components/marketing/BookFrame/BookFrame'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import Testimonials from '../../../components/Testimonials/Testimonials'
import { bookletProduct } from '../../../../lib/content/products'
import { getContactHref } from '../../../../lib/contact'
import { buildPageMetadata, buildProductJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../lib/JsonLd'
import catalogStyles from '../../catalog-page.module.scss'
import styles from '../../clinical/page.module.scss'
import lessonStyles from '../../private-lessons/page.module.scss'

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
          ctaLabel={product.hero.ctaLabel}
          visual={
            <BookFrame src={product.image.src} alt={product.image.alt} priority />
          }
        />

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <ul className={catalogStyles.list}>
              {product.metrics.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{product.whyNeeded.title}</h2>
            {product.whyNeeded.paragraphs.map((paragraph) => (
              <p key={paragraph} className={catalogStyles.sectionSub}>
                {paragraph}
              </p>
            ))}
          </Container>
        </section>

        <section className={styles.bentoSection}>
          <Container>
            <h2 className={styles.sectionTitle}>{product.features.title}</h2>
            <div className={styles.bento}>
              {product.features.items.map((f, i) => (
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
                <h2>{product.audience.title}</h2>
                <ul className={catalogStyles.list}>
                  {product.audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{product.whyDifferent.title}</h2>
            <ul className={catalogStyles.list}>
              {product.whyDifferent.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={lessonStyles.steps}>
          <Container>
            <h2>{product.journey.title}</h2>
            <div className={lessonStyles.grid}>
              {product.journey.items.map((step, i) => (
                <article key={step.title}>
                  <span className={lessonStyles.stepNum}>{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <Testimonials title={product.testimonials.title} />

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>שאלות נפוצות</h2>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{product.finalCta.title}</h2>
            <p className={catalogStyles.sectionSub}>{product.finalCta.text}</p>
            <Button href={getContactHref(product.contactService)} variant="primary">
              {product.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
