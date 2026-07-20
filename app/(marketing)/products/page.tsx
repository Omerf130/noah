import Container from '../../components/ui/Container/Container'
import CatalogCard from '../../components/marketing/catalog/CatalogCard/CatalogCard'
import { productsCatalog } from '../../../lib/content/products'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'

export const metadata = buildPageMetadata({
  title: 'מוצרים ללמידה',
  description: 'חוברת המלווה הקליני וערכת תרגול לסטודנטים לסיעוד.',
  path: '/products',
})

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'מוצרים ללמידה',
          description: 'חוברת המלווה הקליני וערכת תרגול לסטודנטים לסיעוד.',
          path: '/products',
        })}
      />
      <div className={styles.page} dir="rtl">
        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h1 className={styles.sectionTitle}>מוצרים</h1>
            <p className={styles.sectionSub}>כלים שמלווים אתכם בלמידה - לבד או לצד ליווי ושיעורים.</p>
            <div className={styles.grid}>
              {productsCatalog.map((product) => (
                <CatalogCard
                  key={product.slug}
                  title={product.title}
                  subtitle={product.subtitle}
                  description={product.shortDescription}
                  href={product.path}
                  contactService={product.contactService}
                  status={product.status}
                  accent={product.slug === 'booklet' ? 'gold' : 'lavender'}
                  image={product.image}
                  ctaLabel="לפרטי המוצר"
                />
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}
