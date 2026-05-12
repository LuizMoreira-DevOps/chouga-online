import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/header.css";
import logoImg from "../assets/images/Logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <img src={logoImg} alt="Logo Chouga Skateboard" />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
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