import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiLock, FiShoppingCart, FiUser } from "react-icons/fi";

import "../css/header.css";
import logoImg from "../assets/logo/Logo.png";

const navLinks = [
  {
    label: "Camisetas",
    path: "/camisetas",
  },
  {
    label: "Blusas",
    path: "/blusas",
  },
  {
    label: "Sobre",
    path: "/sobre",
  },
  {
    label: "Contato",
    path: "/contato",
  },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const visibleNavLinks = navLinks.filter(
    (link) => link.path !== location.pathname,
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((currentState) => !currentState);
  }

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={closeMenu}>
        <div className="logo-wrapper">
          <img src={logoImg} alt="Logo Chouga Skateboard" />

          <span className="logo-mark">®</span>
        </div>
      </Link>

      <div className="header-actions">
        {!isHome && (
          <Link
            to="/"
            className="header-icon-button"
            onClick={closeMenu}
            aria-label="Página inicial"
            title="Página inicial"
          >
            <FiHome />
          </Link>
        )}

        <button
          className="header-icon-button is-locked"
          type="button"
          aria-label="Login em breve"
          title="Login em breve"
        >
          <FiUser />
          <FiLock className="lock-icon" />
        </button>

        <button
          className="header-icon-button is-locked"
          type="button"
          aria-label="Carrinho em breve"
          title="Carrinho em breve"
        >
          <FiShoppingCart />
          <FiLock className="lock-icon" />
        </button>

        {!isHome && (
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
        )}
      </div>

      {!isHome && (
        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          {visibleNavLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}

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
      )}
    </header>
  );
}

export default Header;