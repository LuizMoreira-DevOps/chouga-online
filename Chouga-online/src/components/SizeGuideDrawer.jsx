import { useEffect, useRef } from "react";

import "../css/sizeGuideDrawer.css";

function SizeGuideDrawer({ guide, isOpen, onClose, triggerRef }) {
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef?.current;
    const drawerElement = drawerRef.current;

    document.body.style.overflow = "hidden";

    function getFocusableElements() {
      if (!drawerElement) {
        return [];
      }

      return Array.from(
        drawerElement.querySelectorAll(
          [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      );
    }

    function keepFocusInsideDrawer(event) {
      if (drawerElement?.contains(event.target)) {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return;
      }

      drawerElement?.focus();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        drawerElement?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (
          activeElement === firstElement ||
          !drawerElement?.contains(activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }

        return;
      }

      if (
        activeElement === lastElement ||
        !drawerElement?.contains(activeElement)
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    titleRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInsideDrawer);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInsideDrawer);

      triggerElement?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="size-guide-drawer"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <aside
        ref={drawerRef}
        id="size-guide-drawer"
        className="size-guide-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        aria-describedby="size-guide-description"
        tabIndex={-1}
      >
        <header className="size-guide-drawer__header">
          <div>
            <p className="size-guide-drawer__eyebrow">
              Encontre o tamanho ideal
            </p>

            <h2 ref={titleRef} id="size-guide-title" tabIndex={-1}>
              {guide?.title || "Guia de medidas"}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="size-guide-drawer__close"
            onClick={onClose}
            aria-label="Fechar guia de medidas"
          >
            ×
          </button>
        </header>

        <div className="size-guide-drawer__body">
          <p
            id="size-guide-description"
            className="size-guide-drawer__description"
          >
            {guide?.description ||
              "Consulte as medidas disponíveis para escolher o tamanho ideal."}
          </p>

          <section className="size-guide-drawer__section">
            <h3>Tabela de medidas</h3>

            <div className="size-guide-drawer__table-wrapper">
              <table className="size-guide-drawer__table">
                <thead>
                  <tr>
                    <th scope="col">Tamanho</th>
                    <th scope="col">Largura</th>
                    <th scope="col">Comprimento</th>
                    <th scope="col">Manga</th>
                  </tr>
                </thead>

                <tbody>
                  {(guide?.measurements ?? []).map((measurement) => (
                    <tr key={measurement.size}>
                      <th scope="row">{measurement.size}</th>
                      <td>{measurement.width}</td>
                      <td>{measurement.length}</td>
                      <td>{measurement.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="size-guide-drawer__section">
            <h3>Como medir a peça</h3>

            <div
              className="size-guide-drawer__illustration"
              aria-label="Ilustração de medição será adicionada posteriormente"
            >
              <span>Guia visual em preparação</span>
            </div>

            <ol className="size-guide-drawer__instructions">
              <li>
                <strong>Largura:</strong> meça de uma axila à outra.
              </li>

              <li>
                <strong>Comprimento:</strong> meça do ponto mais alto do ombro
                até a barra.
              </li>

              <li>
                <strong>Manga:</strong> meça da costura do ombro até o punho.
              </li>
            </ol>
          </section>

          <p className="size-guide-drawer__notice">
            As medidas oficiais serão adicionadas assim que estiverem
            disponíveis.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default SizeGuideDrawer;
