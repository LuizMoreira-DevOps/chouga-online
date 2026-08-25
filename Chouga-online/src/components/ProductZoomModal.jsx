import { useEffect, useRef } from "react";

import "../css/productZoomModal.css";

function ProductZoomModal({
  product,
  zoomLevel,
  dragPosition,
  onClose,
  onDecreaseZoom,
  onIncreaseZoom,
  onToggleZoom,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!product) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previouslyFocusedElement = document.activeElement;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("keydown", handleKeyDown);

      requestAnimationFrame(() => {
        if (previouslyFocusedElement instanceof HTMLElement) {
          previouslyFocusedElement.focus();
        }
      });
    };
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const productTitle = product.title || product.nome || "Produto Chouga";
  const productImageAlt = product.imageAlt || productTitle;

  const zoomPercentage = Math.round(zoomLevel * 100);
  const isZoomed = zoomLevel > 1;

  return (
    <div className="product-zoom-overlay" role="presentation" onClick={onClose}>
      <article
        className="product-zoom-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Imagem ampliada de ${productTitle}`}
        aria-describedby="product-zoom-hint"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="action zoom-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização ampliada"
        >
          <span className="zoom-close-label">Fechar</span>

          <span className="zoom-close-icon" aria-hidden="true">
            ×
          </span>
        </button>

        <div
          className={`zoom-image-wrapper ${
            isZoomed ? "is-draggable is-zoomed" : ""
          }`}
          onClick={onToggleZoom}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerLeave}
        >
          <img
            src={product.image}
            alt={productImageAlt}
            draggable="false"
            style={{
              transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) scale(${zoomLevel})`,
            }}
          />

          <p id="product-zoom-hint" className="product-zoom-hint">
            {isZoomed
              ? "Arraste para explorar • Clique para reduzir"
              : "Clique na imagem para ampliar"}
          </p>
        </div>

        <footer className="product-zoom-footer">
          <div className="product-zoom-info">
            <h3>{productTitle}</h3>

            {product.price && <span>{product.price}</span>}
          </div>

          <div className="zoom-actions" aria-label="Controles de zoom">
            <button
              type="button"
              onClick={onDecreaseZoom}
              disabled={zoomLevel <= 1}
              aria-label="Diminuir zoom"
            >
              −
            </button>

            <span aria-live="polite">{zoomPercentage}%</span>

            <button
              type="button"
              onClick={onIncreaseZoom}
              disabled={zoomLevel >= 2.4}
              aria-label="Aumentar zoom"
            >
              +
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}

export default ProductZoomModal;
