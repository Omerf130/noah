import "./Nav.scss";
import logo from "../../../../public/pics/logo.jpeg";

const Nav = () => {
  return (
    <header className="nav-wrapper">
      <nav className="nav-container">
        <div className="nav-links">
          <a href="#about">קצת עליי</a>
          <a href="#about">ליווי אישי</a>
          <a href="#services">המלווה הקליני</a>
          <a href="#privatelessons">שיעורים פרטיים</a>
          <a href="#contact">צור קשר</a>
        </div>

        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </nav>
    </header>
  );
};

export default Nav;
