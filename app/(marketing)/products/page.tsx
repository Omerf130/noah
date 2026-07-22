import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import CatalogCard from '../../components/marketing/catalog/CatalogCard/CatalogCard'
import { productsCatalog, productsPage } from '../../../lib/content/products'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'

export const metadata = buildPageMetadata({
  title: productsPage.seo.title,
  description: productsPage.seo.description,
  path: '/products',
})

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: productsPage.seo.title,
          description: productsPage.seo.description,
          path: '/products',
        })}
      />
      <div className={styles.page} dir="rtl">
        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h1 className={styles.sectionTitle}>{productsPage.title}</h1>
            <p className={styles.sectionSub}>{productsPage.intro}</p>
            <div className={styles.cta}>
              <Button href={productsPage.heroCtaHref} variant="primary">
                {productsPage.heroCta}
              </Button>
            </div>
          </Container>
        </section>

        <section className={[styles.section, styles.white].join(' ')}>
          <Container>
            <h2 className={styles.sectionTitle}>{productsPage.whyProducts.title}</h2>
            <ul className={styles.list}>
              {productsPage.whyProducts.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={[styles.section, styles.warm].join(' ')} id="products">
          <Container>
            <h2 className={styles.sectionTitle}>{productsPage.catalogTitle}</h2>
            <div className={styles.grid}>
              {productsCatalog.map((product) => (
                <CatalogCard
                  key={product.slug}
                  title={product.title}
                  subtitle={product.subtitle || undefined}
                  description={product.shortDescription}
                  href={product.path}
                  contactService={product.contactService}
                  status={product.status}
                  accent={product.slug === 'booklet' ? 'gold' : 'lavender'}
                  image={product.image}
                  ctaLabel={product.ctaLabel}
                />
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.cta}>
          <Container>
            <h2 className={styles.sectionTitle}>{productsPage.finalCta.title}</h2>
            <p className={styles.sectionSub}>{productsPage.finalCta.text}</p>
            <Button href={productsPage.finalCta.buttonHref} variant="primary">
              {productsPage.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
