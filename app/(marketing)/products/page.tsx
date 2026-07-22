import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import CatalogCard from '../../components/marketing/catalog/CatalogCard/CatalogCard'
import { productsCatalog, productsPage } from '../../../lib/content/products'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import catalogStyles from '../catalog-page.module.scss'
import styles from './page.module.scss'

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
      <div className={catalogStyles.page} dir="rtl">
        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')}>
          <Container>
            <h1 className={catalogStyles.sectionTitle}>{productsPage.title}</h1>
            <p className={catalogStyles.sectionSub}>{productsPage.intro}</p>
            <div className={catalogStyles.cta}>
              <Button href={productsPage.heroCtaHref} variant="primary">
                {productsPage.heroCta}
              </Button>
            </div>
          </Container>
        </section>

        <section className={[catalogStyles.section, catalogStyles.white].join(' ')}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{productsPage.whyProducts.title}</h2>
            <ul className={styles.checkListCard}>
              {productsPage.whyProducts.items.map((item) => (
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

        <section className={[catalogStyles.section, catalogStyles.warm].join(' ')} id="products">
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{productsPage.catalogTitle}</h2>
            <div className={catalogStyles.grid}>
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
                  showContactLink={false}
                />
              ))}
            </div>
          </Container>
        </section>

        <section className={catalogStyles.cta}>
          <Container>
            <h2 className={catalogStyles.sectionTitle}>{productsPage.finalCta.title}</h2>
            <p className={catalogStyles.sectionSub}>{productsPage.finalCta.text}</p>
            <Button href={productsPage.finalCta.buttonHref} variant="primary">
              {productsPage.finalCta.buttonLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
