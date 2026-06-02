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
  if (!product) {
    return null;
  }

  return (
    <div
      className="product-zoom-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="product-zoom-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
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

        <div className="zoom-controls">
          <div className="zoom-actions">
            <button
              type="button"
              onClick={onDecreaseZoom}
              aria-label="Diminuir zoom"
            >
              −
            </button>

            <button
              type="button"
              onClick={onIncreaseZoom}
              aria-label="Aumentar zoom"
            >
              +
            </button>
          </div>
        </div>

        <div
          className={`zoom-image-wrapper ${
            zoomLevel > 1 ? "is-draggable" : ""
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerLeave}
        >
          <img
            src={product.image}
            alt={product.title}
            draggable="false"
            style={{
              transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${zoomLevel})`,
            }}
          />
        </div>

        <div className="product-zoom-info">
          <h3>{product.title}</h3>
          <span>{product.price}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductZoomModal;