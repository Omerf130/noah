import type { Metadata } from 'next'
import Hero from '../components/Hero/Hero'
import MetricsBand from '../components/marketing/home/MetricsBand/MetricsBand'
import PainPoints from '../components/marketing/home/PainPoints/PainPoints'
import Philosophy from '../components/marketing/home/Philosophy/Philosophy'
import ServicesShowcase from '../components/marketing/home/ServicesShowcase/ServicesShowcase'
import ProcessTimeline from '../components/marketing/home/ProcessTimeline/ProcessTimeline'
import MeetNoa from '../components/marketing/home/MeetNoa/MeetNoa'
import ProofSection from '../components/marketing/home/ProofSection/ProofSection'
import FAQ from '../components/FAQ/FAQ'
import ConversionBand from '../components/marketing/home/ConversionBand/ConversionBand'
import Contact from '../components/Contact/Contact'
import { buildPageMetadata, buildWebPageJsonLd } from '../../lib/seo'
import { JsonLd } from '../../lib/JsonLd'
import { siteConfig } from '../../lib/site'

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: siteConfig.title,
          description: siteConfig.description,
          path: '/',
        })}
      />
      <Hero />
      <MetricsBand />
      <PainPoints />
      <Philosophy />
      <ServicesShowcase />
      <ProcessTimeline />
      <MeetNoa />
      <ProofSection />
      <FAQ />
      <ConversionBand />
      <Contact />
    </>
  )
}
