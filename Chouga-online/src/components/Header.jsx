import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const triggerRef = useRef(null);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const currentSection = getCurrentSection(location.pathname);

  function closeMenu({ restoreFocus = false } = {}) {
    setMenuOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }

  function toggleMenu() {
    setMenuOpen((current) => !current);
  }

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);

        requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`header ${menuOpen ? "is-expanded" : ""}`}
    >
      <div className="header-main">
        <Link
          to="/"
          className="logo"
          onClick={() => closeMenu()}
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
              ref={triggerRef}
              className={`header-menu-trigger ${menuOpen ? "is-open" : ""}`}
              type="button"
              aria-label={`${currentSection}, ${
                menuOpen ? "fechar menu" : "abrir menu"
              }`}
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
          </div>
        )}
      </div>

      {!isHome && (
        <div
          id="header-navigation-menu"
          className={`header-menu-panel ${menuOpen ? "is-open" : ""}`}
        >
          <nav className="nav" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const isCurrent = isCurrentSection(location.pathname, link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={isCurrent ? "is-current" : ""}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => closeMenu()}
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
