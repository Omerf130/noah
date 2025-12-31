import './App.css'
import About from './assets/components/About/About'
import Clinical from './assets/components/Clinical/Clinical'
import Contact from './assets/components/Contact/Contact'
import Nav from './assets/components/Nav/Nav'
import PrivateLessons from './assets/components/PrivateLessons/PrivateLessons'
import PrivateProcess from './assets/components/PrivateProcess/PrivateProcess'

function App() {

  return (
    <>
      <Nav/>
      <About/>
      <PrivateProcess/>
      <Clinical/>
      <PrivateLessons/>
      <Contact/>
    </>
  )
}

export default App
