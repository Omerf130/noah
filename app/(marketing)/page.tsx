import type { Metadata } from 'next'
import Hero from '../components/Hero/Hero'
import MetricsBand from '../components/marketing/home/MetricsBand/MetricsBand'
import ServicesShowcase from '../components/marketing/home/ServicesShowcase/ServicesShowcase'
import ProofSection from '../components/marketing/home/ProofSection/ProofSection'
import PainPoints from '../components/marketing/home/PainPoints/PainPoints'
import MeetNoa from '../components/marketing/home/MeetNoa/MeetNoa'
import Testimonials from '../components/Testimonials/Testimonials'
import ConversionBand from '../components/marketing/home/ConversionBand/ConversionBand'
import FAQ from '../components/FAQ/FAQ'
import Contact from '../components/Contact/Contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../lib/seo'
import { JsonLd } from '../../lib/JsonLd'
import { siteConfig } from '../../lib/site'
import {
  homepageConsultation,
  homepageFinalCta,
  homepageSeoDescription,
} from '../../lib/content/homepage'

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.title,
  description: homepageSeoDescription,
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: siteConfig.title,
          description: homepageSeoDescription,
          path: '/',
        })}
      />
      <Hero />
      <MetricsBand />
      <ServicesShowcase />
      <ProofSection />
      <PainPoints />
      <MeetNoa />
      <Testimonials />
      <ConversionBand
        title={homepageConsultation.title}
        text={homepageConsultation.text}
        buttonLabel={homepageConsultation.buttonLabel}
        buttonHref={homepageConsultation.buttonHref}
      />
      <FAQ />
      <ConversionBand
        title={homepageFinalCta.title}
        text={homepageFinalCta.text}
        buttonLabel={homepageFinalCta.buttonLabel}
        buttonHref={homepageFinalCta.buttonHref}
      />
      <Contact />
    </>
  )
}
