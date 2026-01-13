
import About from '../components/About/About'
import Clinical from '../components/Clinical/Clinical'
import Contact from '../components/Contact/Contact'
import Nav from '../components/Nav/Nav'
import PrivateLessons from '../components/PrivateLessons/PrivateLessons'
import PrivateProcess from '../components/PrivateProcess/PrivateProcess'
import './App.css'

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
