import { useEffect } from "react";

import "../css/productDetailsModal.css";

function formatTextList(items) {
  if (!items || items.length === 0) {
    return "Não informado";
  }

  return items
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" / ");
}

function getProductDescription(product) {
  return product.descricao || product.description || "";
}

function getProductInspiration(product) {
  return product.inspiracao || product.inspiration || "";
}

function ProductDetailsModal({ product, onClose, whatsappPhone }) {
  const description = getProductDescription(product);
  const inspiration = getProductInspiration(product);

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse na ${product.title}.`,
  );

  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="product-details-overlay"
      role="presentation"
      onClick={onClose}
    >
      <article
        className="product-details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do produto ${product.title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="product-details-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          ×
        </button>

        <div className="product-details-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-details-content">
          <span className="product-details-kicker">Produto</span>

          <h2>{product.title}</h2>
          <strong>{product.price}</strong>

          <dl className="product-details-specs">
            <div>
              <dt>Tamanhos</dt>
              <dd>{formatTextList(product.sizes)}</dd>
            </div>

            <div>
              <dt>Cores</dt>
              <dd>{formatTextList(product.colors)}</dd>
            </div>
          </dl>

          {description && (
            <section className="product-details-section">
              <h3>Descrição</h3>
              <p>{description}</p>
            </section>
          )}

          {inspiration && (
            <section className="product-details-section">
              <h3>Inspiração</h3>
              <p>{inspiration}</p>
            </section>
          )}

          <a
            className="product-details-whatsapp"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </article>
    </div>
  );
}

export default ProductDetailsModal;
