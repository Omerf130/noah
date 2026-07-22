import Image from 'next/image'
import PageHero from '../../components/marketing/pages/PageHero/PageHero'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { aboutPage } from '../../../lib/content/about'
import { buildPageMetadata, buildWebPageJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../lib/JsonLd'
import styles from './page.module.scss'

export const metadata = buildPageMetadata({
  title: aboutPage.seo.title,
  description: aboutPage.seo.description,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: aboutPage.seo.title,
          description: aboutPage.seo.description,
          path: '/about',
        })}
      />
      <div className={styles.page} dir="rtl">
        <PageHero
          variant="split"
          eyebrow={aboutPage.hero.eyebrow}
          title={aboutPage.hero.title}
          subtitle={`${aboutPage.hero.subtitle} ${aboutPage.hero.belief}`}
          ctaHref={aboutPage.hero.ctaHref}
          ctaLabel={aboutPage.hero.ctaLabel}
        />

        <section className={styles.section}>
          <Container>
            <div className={styles.splitGrid}>
              <div className={styles.portraitWrap}>
                <Image
                  src="/pics/noa.jpeg"
                  alt="נועה — מייסדת נוח"
                  width={420}
                  height={500}
                  className={styles.portrait}
                />
              </div>
              <div>
                <h2 className={styles.h2}>{aboutPage.origin.title}</h2>
                {aboutPage.origin.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.p}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container>
            <h2 className={styles.h2}>{aboutPage.offerings.title}</h2>
            <p className={styles.p}>{aboutPage.offerings.intro}</p>
            <ul className={styles.offeringsList}>
              {aboutPage.offerings.items.map((item) => (
                <li key={item} className={styles.offeringsItem}>
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={styles.section}>
          <Container>
            <h2 className={styles.h2}>{aboutPage.nameStory.title}</h2>
            {aboutPage.nameStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.p}>
                {paragraph}
              </p>
            ))}
          </Container>
        </section>

        <section className={styles.ctaBand}>
          <Container>
            <p className={styles.ctaText}>{aboutPage.closing}</p>
            <Button href={aboutPage.hero.ctaHref} variant="secondary">
              {aboutPage.hero.ctaLabel}
            </Button>
          </Container>
        </section>
      </div>
    </>
  )
}
