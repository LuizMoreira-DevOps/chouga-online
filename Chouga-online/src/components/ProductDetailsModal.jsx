import { useEffect, useState } from "react";
import { sortProductSizes } from "../constants/productFilters";

import "../css/productDetailsModal.css";

function formatLabel(value) {
  if (!value) {
    return "";
  }

  const text = String(value);

  return text.charAt(0).toUpperCase() + text.slice(1);
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

  const colors = product.colors || [];
  const sizes = sortProductSizes(product.sizes || []);

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

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

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) => currentQuantity + 1);
  }

  const whatsappLines = [
    "Olá! Gostei desse produto da Chouga:",
    "",
    `Produto: ${product.title}`,
    selectedColor ? `Cor: ${formatLabel(selectedColor)}` : null,
    selectedSize ? `Tamanho: ${String(selectedSize).toUpperCase()}` : null,
    `Quantidade: ${quantity}`,
    `Preço: ${product.price}`,
    /*product.image ? `Imagem: ${product.image}` : null,*/
    "",
    "Pode me ajudar com a compra?",
  ].filter(Boolean);

  const whatsappMessage = encodeURIComponent(whatsappLines.join("\n"));
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

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

          <div className="product-details-options">
            {colors.length > 0 && (
              <section className="product-details-option-group">
                <h3>Escolha a cor</h3>

                <div className="product-details-choice-list">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`product-details-choice${
                        selectedColor === color ? " is-active" : ""
                      }`}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-pressed={selectedColor === color}
                    >
                      {formatLabel(color)}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {sizes.length > 0 && (
              <section className="product-details-option-group">
                <h3>Escolha o tamanho</h3>

                <div className="product-details-choice-list">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`product-details-choice${
                        selectedSize === size ? " is-active" : ""
                      }`}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {String(size).toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="product-details-option-group">
              <h3>Quantidade</h3>

              <div className="product-details-quantity">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Diminuir quantidade"
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </section>
          </div>

          <a
            className="product-details-whatsapp"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Comprar pelo WhatsApp
          </a>
        </div>
      </article>
    </div>
  );
}

export default ProductDetailsModal;