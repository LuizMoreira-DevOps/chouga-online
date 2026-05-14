import { useState } from "react";
import { Link } from "react-router-dom";

import "../css/header.css";
import logoImg from "../assets/images/Logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((currentState) => !currentState);
  }

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={closeMenu}>
        <img src={logoImg} alt="Logo Chouga Skateboard" />
      </Link>

      <button
        className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <Link to="/sobre" onClick={closeMenu}>
          Sobre
        </Link>

        <Link to="/contato" onClick={closeMenu}>
          Contato
        </Link>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          Instagram
        </a>

        <span className="nav-badge">Drop em breve</span>
      </nav>
    </header>
  );
}

export default Header;