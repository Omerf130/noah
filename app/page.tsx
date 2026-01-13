import Nav from './components/Nav/Nav'
import About from './components/About/About'
import PrivateProcess from './components/PrivateProcess/PrivateProcess'
import Clinical from './components/Clinical/Clinical'
import PrivateLessons from './components/PrivateLessons/PrivateLessons'
import Contact from './components/Contact/Contact'

export default function Home() {
  return (
    <>
      <Nav />
      <About />
      <PrivateProcess />
      <Clinical />
      <PrivateLessons />
      <Contact />
    </>
  )
}


