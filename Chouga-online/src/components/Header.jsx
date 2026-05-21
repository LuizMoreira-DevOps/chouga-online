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
  {
    label: "EM BREVE",
    path: "/em-breve",
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
            <FiHome aria-hidden="true" />
          </Link>
        )}

        <Link
          to="/em-breve"
          className="header-icon-button is-locked"
          title="Login em breve"
          aria-label="Login em breve"
          onClick={closeMenu}
        >
          <FiUser aria-hidden="true" />
          <FiLock className="lock-icon" aria-hidden="true" />
        </Link>

        <Link
          to="/em-breve"
          className="header-icon-button is-locked"
          title="Carrinho em breve"
          aria-label="Carrinho em breve"
          onClick={closeMenu}
        >
          <FiShoppingCart aria-hidden="true" />
          <FiLock className="lock-icon" aria-hidden="true" />
        </Link>

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
        </nav>
      )}
    </header>
  );
}

export default Header;