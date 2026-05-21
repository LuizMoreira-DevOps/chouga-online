import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

import camisetasData from "../data/camisetas.json";

import "../css/camisetas.css";

const imageFiles = {
  camisetaBranca: "camiseta-skateboard-branca.jpeg",
  camisetaBelinhaPrimavera: "camiseta-belinha-primavera.jpeg",
  camisetaLife: "camiseta-life.jpeg",
  camisetaBomber: "camiseta-bomber-cinza.jpeg",
  camisetaBelinhaOutono: "camiseta-belinha-outono.jpeg",
  camisetaPreta: "camiseta-skateboard-preta.jpeg",
  camisetaSkull: "camiseta-chouga-skull.jpeg",
  camisetaCity: "camiseta-chouga-city.jpeg",
  camisetaPraia: "camiseta-chouga-praia.jpeg",
  camisetaBasicPreta: "camiseta-chouga-basic-preta.jpeg",
  camisetaBasicBranca: "camiseta-chouga-basic-branca.jpeg",
  camisetaChougaBranca: "camiseta-chouga-branca.jpeg",
  camisetaChougaAzul: "camiseta-chouga-azul.jpeg",
  camisetaBasicCinza: "camiseta-chouga-basic-cinza.jpeg",
  camisetaChougaWeed: "camiseta-chouga-weed.jpeg",
};

function getProductImage(imageKey) {
  return new URL(
    `../assets/images/camisetas/${imageFiles[imageKey]}`,
    import.meta.url,
  ).href;
}

const products = camisetasData.map((product) => ({
  ...product,
  image: getProductImage(product.imageKey),
}));

const categories = [
  { label: "Todas", value: "todos" },
  { label: "Básicas", value: "básicas" },
  { label: "Estampadas", value: "estampadas" },
  { label: "Colabs", value: "colabs" },
];

function Camisetas() {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  function openProduct(product) {
    setSelectedProduct(product);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    setDragStart(null);
  }

  function closeProduct() {
    setSelectedProduct(null);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    setDragStart(null);
  }

  function decreaseZoom() {
    setZoomLevel((value) => {
      const nextValue = Math.max(1, value - 0.2);

      if (nextValue === 1) {
        setDragPosition({ x: 0, y: 0 });
        setDragStart(null);
      }

      return nextValue;
    });
  }

  function increaseZoom() {
    setZoomLevel((value) => Math.min(2.4, value + 0.2));
  }

  function handlePointerDown(event) {
    if (zoomLevel <= 1) {
      return;
    }

    setDragStart({
      x: event.clientX - dragPosition.x,
      y: event.clientY - dragPosition.y,
    });
  }

  function handlePointerMove(event) {
    if (!dragStart || zoomLevel <= 1) {
      return;
    }

    setDragPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  }

  function stopDragging() {
    setDragStart(null);
  }

  function toggleSizeFilter(size) {
    setSizeFilter((currentSize) => (currentSize === size ? "todos" : size));
  }

  function toggleColorFilter(color) {
    setColorFilter((currentColor) =>
      currentColor === color ? "todos" : color,
    );
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      categoryFilter === "todos" || product.category === categoryFilter;

    const matchSize =
      sizeFilter === "todos" || product.sizes.includes(sizeFilter);

    const matchColor =
      colorFilter === "todos" || product.colors.includes(colorFilter);

    return matchCategory && matchSize && matchColor;
  });

  return (
    <Layout>
      <main
        className={`camisetas-page page-bg ${
          selectedProduct ? "is-zoom-open" : ""
        }`}
      >
        <section className="camisetas-section page-section">
          <div className="camisetas-container page-container">
            <aside className="camisetas-sidebar">
              <nav className="camisetas-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/camisetas">Camiseta</Link>
              </nav>

              <div className="filter-group">
                <h2>Categorias</h2>

                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`filter-button ${
                      categoryFilter === category.value ? "is-active" : ""
                    }`}
                    type="button"
                    onClick={() => setCategoryFilter(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="filter-divider"></div>

              <div className="filter-group">
                <h2>Tamanhos</h2>

                <div className="size-list">
                  {["P", "M", "G", "GG", "XG"].map((size) => (
                    <button
                      key={size}
                      className={sizeFilter === size ? "is-active" : ""}
                      type="button"
                      onClick={() => toggleSizeFilter(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h2>Cores</h2>

                <div className="color-list">
                  <button
                    className={`color-dot color-black ${
                      colorFilter === "preto" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Preto"
                    title="Preto"
                    onClick={() => toggleColorFilter("preto")}
                  ></button>

                  <button
                    className={`color-dot color-gray ${
                      colorFilter === "cinza" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Cinza"
                    title="Cinza"
                    onClick={() => toggleColorFilter("cinza")}
                  ></button>

                  <button
                    className={`color-dot color-white ${
                      colorFilter === "branco" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Branco"
                    title="Branco"
                    onClick={() => toggleColorFilter("branco")}
                  ></button>

                  <button
                    className={`color-dot color-red ${
                      colorFilter === "vermelho" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Vermelho"
                    title="Vermelho"
                    onClick={() => toggleColorFilter("vermelho")}
                  ></button>

                  <button
                    className={`color-dot color-beige ${
                      colorFilter === "bege" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Bege"
                    title="Bege"
                    onClick={() => toggleColorFilter("bege")}
                  ></button>

                  <button
                    className={`color-dot color-blue ${
                      colorFilter === "azul" ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Azul"
                    title="Azul"
                    onClick={() => toggleColorFilter("azul")}
                  ></button>
                </div>
              </div>
            </aside>

            <section className="camisetas-content">
              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <button
                        className="product-card-button"
                        type="button"
                        onClick={() => openProduct(product)}
                      >
                        <div className="product-image">
                          <img src={product.image} alt={product.title} />
                        </div>

                        <div className="product-info">
                          <h3>{product.title}</h3>
                          <span>{product.price}</span>
                        </div>
                      </button>

                      <div className="product-actions">
                        <button
                          type="button"
                          onClick={() => openProduct(product)}
                        >
                          Saiba mais
                        </button>

                        <a
                          href={`https://wa.me/5541997485063?text=${encodeURIComponent(
                            `Olá! Tenho interesse na ${product.title}.`,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="products-empty">
                  Nenhum produto encontrado nessa categoria.
                </p>
              )}

              {selectedProduct && (
                <div
                  className="product-zoom-overlay"
                  role="presentation"
                  onClick={closeProduct}
                >
                  <div
                    className="product-zoom-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedProduct.title}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="zoom-controls">
                      <button
                        className="zoom-close"
                        type="button"
                        onClick={closeProduct}
                        aria-label="Fechar zoom"
                      >
                        ×
                      </button>

                      <div className="zoom-actions">
                        <button
                          type="button"
                          onClick={decreaseZoom}
                          aria-label="Diminuir zoom"
                        >
                          −
                        </button>

                        <button
                          type="button"
                          onClick={increaseZoom}
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
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={stopDragging}
                      onPointerCancel={stopDragging}
                      onPointerLeave={stopDragging}
                    >
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        draggable="false"
                        style={{
                          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${zoomLevel})`,
                        }}
                      />
                    </div>

                    <div className="product-zoom-info">
                      <h3>{selectedProduct.title}</h3>
                      <span>{selectedProduct.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>

        <button
          className="back-to-top"
          type="button"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      </main>
    </Layout>
  );
}

export default Camisetas;