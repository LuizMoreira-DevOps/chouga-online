import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "../css/header.css";
import logoImg from "../assets/logo/Logo.png";

const navLinks = [
  {
    label: "Produtos",
    path: "/produtos",
  },
  {
    label: "Sobre",
    path: "/sobre",
  },
  {
    label: "Fale com a gente",
    path: "/contato",
  },
];

function getCurrentSection(pathname) {
  if (pathname.startsWith("/produtos")) {
    return "Produtos";
  }

  if (pathname === "/sobre") {
    return "Sobre";
  }

  if (pathname === "/contato") {
    return "Fale com a gente";
  }

  return "Menu";
}

function isCurrentSection(pathname, path) {
  if (path === "/produtos") {
    return pathname.startsWith("/produtos");
  }

  return pathname === path;
}

function Header() {
  const [menuOpenPath, setMenuOpenPath] = useState(null);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const currentSection = getCurrentSection(location.pathname);
  const menuOpen = menuOpenPath === location.pathname;

  function closeMenu() {
    setMenuOpenPath(null);
  }

  function toggleMenu() {
    setMenuOpenPath((currentPath) =>
      currentPath === location.pathname ? null : location.pathname,
    );
  }

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpenPath(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
        aria-label="Chouga - Página inicial"
      >
        <div className="logo-wrapper">
          <img src={logoImg} alt="Chouga Skateboard" />

          <span className="logo-mark" aria-hidden="true">
            ®
          </span>
        </div>
      </Link>

      {!isHome && (
        <div className="header-navigation">
          <button
            className={`header-menu-trigger ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="header-navigation-menu"
            onClick={toggleMenu}
          >
            <span className="header-current-section">{currentSection}</span>

            <span className="menu-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <nav
            id="header-navigation-menu"
            className={`nav ${menuOpen ? "nav-open" : ""}`}
            aria-label="Navegação principal"
          >
            {navLinks.map((link) => {
              const isCurrent = isCurrentSection(location.pathname, link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={isCurrent ? "is-current" : ""}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
