import { useEffect } from "react";

import "../css/productZoomModal.css";

function ProductZoomModal({
  product,
  zoomLevel,
  dragPosition,
  onClose,
  onDecreaseZoom,
  onIncreaseZoom,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
}) {
  useEffect(() => {
    if (!product) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

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
    };
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const productTitle = product.title || product.nome || "Produto Chouga";

  const productImageAlt = product.imageAlt || productTitle;

  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div className="product-zoom-overlay" role="presentation" onClick={onClose}>
      <article
        className="product-zoom-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Imagem ampliada de ${productTitle}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="zoom-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar zoom"
        >
          ×
        </button>

        <div
          className="zoom-image-wrapper is-draggable"
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
