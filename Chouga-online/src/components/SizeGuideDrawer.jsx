import { useEffect, useRef } from "react";

import "../css/sizeGuideDrawer.css";

function SizeGuideDrawer({ guide, isOpen, onClose, triggerRef }) {
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

  if (!isOpen || !guide) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const columns = Array.isArray(guide.columns) ? guide.columns : [];
  const measurements = Array.isArray(guide.measurements)
    ? guide.measurements
    : [];
  const instructions = Array.isArray(guide.instructions)
    ? guide.instructions
    : [];

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
              {guide.title}
            </h2>
          </div>
        </header>

        <div className="size-guide-drawer__body">
          <p
            id="size-guide-description"
            className="size-guide-drawer__description"
          >
            {guide.description}
          </p>

          {columns.length > 0 && measurements.length > 0 && (
            <section className="size-guide-drawer__section">
              <h3>Tabela de medidas</h3>

              <div className="size-guide-drawer__table-wrapper">
                <table className="size-guide-drawer__table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key} scope="col">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {measurements.map((measurement) => (
                      <tr key={measurement.size}>
                        {columns.map((column, columnIndex) => {
                          const value = measurement[column.key];

                          if (columnIndex === 0) {
                            return (
                              <th key={column.key} scope="row">
                                {value}
                              </th>
                            );
                          }

                          return (
                            <td key={column.key}>
                              {value !== undefined && value !== null
                                ? `${value} cm`
                                : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="size-guide-drawer__section">
            <h3>Como medir a peça</h3>

            {guide.image ? (
              <div className="size-guide-drawer__illustration">
                <img
                  src={guide.image}
                  alt={
                    guide.imageAlt ||
                    `Ilustração de como medir ${guide.title.toLowerCase()}`
                  }
                />
              </div>
            ) : (
              <div
                className="size-guide-drawer__illustration"
                aria-label="Ilustração de medição será adicionada posteriormente"
              >
                <span>Guia visual em preparação</span>
              </div>
            )}

            {instructions.length > 0 && (
              <ol className="size-guide-drawer__instructions">
                {instructions.map((instruction) => (
                  <li key={instruction.label}>
                    <strong>{instruction.label}:</strong> {instruction.text}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {guide.tolerance && (
            <p className="size-guide-drawer__notice">{guide.tolerance}</p>
          )}
        </div>

        <footer className="size-guide-drawer__footer">
          <button
            type="button"
            className="size-guide-drawer__close"
            onClick={onClose}
            aria-label="Voltar ao produto"
          >
            <span aria-hidden="true">←</span>
            <span>Voltar ao produto</span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default SizeGuideDrawer;
