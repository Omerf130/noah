import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import HowItWorks from './components/HowItWorks/HowItWorks'
import About from './components/About/About'
import ValueCards from './components/ValueCards/ValueCards'
import PrivateProcess from './components/PrivateProcess/PrivateProcess'
import Clinical from './components/Clinical/Clinical'
import PrivateLessons from './components/PrivateLessons/PrivateLessons'
import HowToChoose from './components/HowToChoose/HowToChoose'
import Testimonials from './components/Testimonials/Testimonials'
import FAQ from './components/FAQ/FAQ'
import FinalCTA from './components/FinalCTA/FinalCTA'
import Contact from './components/Contact/Contact'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <HowItWorks />
      <About />
      <ValueCards />
      <div id="services">
        <PrivateProcess />
        <Clinical />
        <PrivateLessons />
      </div>
      <HowToChoose />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Contact />
    </>
  )
}


