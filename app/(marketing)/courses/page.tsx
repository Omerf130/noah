import Container from '../../components/ui/Container/Container'
import CatalogCard from '../../components/marketing/catalog/CatalogCard/CatalogCard'
import { coursesCatalog } from '../../../lib/content/courses'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from '../catalog-page.module.scss'

export const metadata = buildPageMetadata({
  title: 'קורסים לסטודנטים לסיעוד',
  description: 'קורסים דיגיטליים לסטודנטים לסיעוד — כולל קורס חישוב רוקחי.',
  path: '/courses',
})

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'קורסים לסטודנטים לסיעוד',
          description: 'קורסים דיגיטליים לסטודנטים לסיעוד.',
          path: '/courses',
        })}
      />
      <div className={styles.page} dir="rtl">
        <section className={[styles.section, styles.warm].join(' ')}>
          <Container>
            <h1 className={styles.sectionTitle}>קורסים</h1>
            <p className={styles.sectionSub}>למידה דיגיטלית מסודרת — בקצב שלכם, עם תרגול מעשי.</p>
            <div className={styles.grid}>
              {coursesCatalog.map((course) => (
                <CatalogCard
                  key={course.slug}
                  title={course.title}
                  subtitle={course.status === 'coming-soon' ? 'בקרוב' : undefined}
                  description={course.shortDescription}
                  href={course.path}
                  contactService={course.contactService}
                  status={course.status}
                  accent="lavender"
                  ctaLabel="לפרטי הקורס"
                />
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}
