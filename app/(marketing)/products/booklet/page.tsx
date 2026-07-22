import PageHero from '../../../components/marketing/pages/PageHero/PageHero'
import BookFrame from '../../../components/marketing/BookFrame/BookFrame'
import Container from '../../../components/ui/Container/Container'
import Button from '../../../components/ui/Button/Button'
import PainPoints from '../../../components/marketing/home/PainPoints/PainPoints'
import Testimonials from '../../../components/Testimonials/Testimonials'
import { bookletProduct } from '../../../../lib/content/products'
import { getContactHref } from '../../../../lib/contact'
import { buildPageMetadata, buildProductJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../lib/JsonLd'
import catalogStyles from '../../catalog-page.module.scss'
import styles from './page.module.scss'

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

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{product.features.title}</h2>
            <ul className={styles.featureCards}>
              {product.features.items.map((feature) => (
                <li key={feature.title}>
                  <strong className={styles.featureTitle}>{feature.title}</strong>
                  <p className={styles.featureText}>{feature.text}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={styles.imageSection}>
          <Container>
            <BookFrame src={product.secondaryImage.src} alt={product.secondaryImage.alt} />
          </Container>
        </section>

        <PainPoints title={product.audience.title} items={product.audience.items} />

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{product.whyDifferent.title}</h2>
            <ul className={styles.checkListCard}>
              {product.whyDifferent.items.map((item) => (
                <li key={item}>
                  <span className={styles.checkMark} aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={styles.journeySection}>
          <Container>
            <h2>{product.journey.title}</h2>
            <div className={styles.journeyGrid}>
              {product.journey.items.map((step, index) => (
                <article key={step.title} className={styles.journeyCard}>
                  <span className={styles.stepNum}>{index + 1}</span>
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
