import { Link } from "react-router-dom";
import "../css/header.css";
import logoImg from "../assets/images/Logo.png";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logoImg} alt="Logo Chouga Skateboard" />
      </Link>

      <nav className="nav">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          Instagram
        </a>

        <a href="https://wa.me/55SEUNUMERO" target="_blank" rel="noreferrer">
          WhatsApp
        </a>

        <span className="nav-badge">Drop em breve</span>
      </nav>
    </header>
  );
}

export default Header;