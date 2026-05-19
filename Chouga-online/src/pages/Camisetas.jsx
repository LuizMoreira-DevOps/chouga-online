import { Link } from "react-router-dom";
import { useState } from "react";

import Layout from "../components/Layout";
import camisetasData from "../data/camisetas.json";

import "../css/camisetas.css";

import camisetaBranca from "../assets/camisetas/camiseta-branca.jpeg";
import camisetaFlower from "../assets/camisetas/camiseta-flower.jpeg";
import camisetaLife from "../assets/camisetas/camiseta-life.jpeg";
import camisetaBomb from "../assets/camisetas/camiseta-bomb.jpeg";
import camisetaHoney from "../assets/camisetas/camiseta-honey.jpeg";
import camisetaPreta from "../assets/camisetas/camiseta-preta.jpeg";

const productImages = {
  camisetaBranca,
  camisetaFlower,
  camisetaLife,
  camisetaBomb,
  camisetaHoney,
  camisetaPreta,
};

const products = camisetasData.map((product) => ({
  ...product,
  image: productImages[product.imageKey],
}));

function Camisetas() {
  const [categoryFilter, setCategoryFilter] = useState("todas");
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

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      categoryFilter === "todas" || product.category === categoryFilter;

    const matchSize =
      sizeFilter === "todos" || product.sizes.includes(sizeFilter);

    const matchColor =
      colorFilter === "todos" || product.colors.includes(colorFilter);

    return matchCategory && matchSize && matchColor;
  });

  return (
    <Layout>
      <main className="camisetas-page page-bg">
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

                <button
                  className={`filter-button ${categoryFilter === "todas" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setCategoryFilter("todas")}
                >
                  Todas
                </button>

                <button
                  className={`filter-button ${categoryFilter === "basicas" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setCategoryFilter("basicas")}
                >
                  Básicas
                </button>

                <button
                  className={`filter-button ${categoryFilter === "estampadas" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setCategoryFilter("estampadas")}
                >
                  Estampadas
                </button>

                <button
                  className={`filter-button ${categoryFilter === "colabs" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setCategoryFilter("colabs")}
                >
                  Colabs
                </button>
              </div>

              <div className="filter-divider"></div>

              <div className="filter-group">
                <h2>Tamanhos</h2>

                <div className="size-list">
                  <button
                  className={sizeFilter === "P" ? "is-active" : ""}
                  type="button"
                  onClick={() => setSizeFilter(sizeFilter === "P" ? "todos" : "P")}
                >
                  P
                </button>
                  <button
                    className={sizeFilter === "M" ? "is-active" : ""}
                    type="button"
                    onClick={() => setSizeFilter(sizeFilter === "M" ? "todos" : "M")}
                  >
                    M
                  </button>
                  <button
                    className={sizeFilter === "G" ? "is-active" : ""}
                    type="button"
                    onClick={() => setSizeFilter(sizeFilter === "G" ? "todos" : "G")}
                  >
                    G
                  </button>
                  <button
                    className={sizeFilter === "GG" ? "is-active" : ""}
                    type="button"
                    onClick={() => setSizeFilter(sizeFilter === "GG" ? "todos" : "GG")}
                  >
                    GG
                  </button>
                  <button
                    className={sizeFilter === "XG" ? "is-active" : ""}
                    type="button"
                    onClick={() => setSizeFilter(sizeFilter === "XG" ? "todos" : "XG")}
                  >
                    XG
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <h2>Cores</h2>

                <div className="color-list">
                  <button
                  className={`color-dot color-black ${colorFilter === "preto" ? "is-active" : ""}`}
                  type="button"
                  aria-label="Preto"
                  onClick={() => setColorFilter(colorFilter === "preto" ? "todos" : "preto")}
                ></button>

                  <button
                    className={`color-dot color-gray ${colorFilter === "cinza" ? "is-active" : ""}`}
                    type="button"
                    aria-label="Cinza"
                    onClick={() => setColorFilter(colorFilter === "cinza" ? "todos" : "cinza")}
                  ></button>

                  <button
                    className={`color-dot color-white ${colorFilter === "branco" ? "is-active" : ""}`}
                    type="button"
                    aria-label="Branco"
                    onClick={() => setColorFilter(colorFilter === "branco" ? "todos" : "branco")}
                  ></button>

                  <button
                  className={`color-dot color-red ${colorFilter === "vermelho" ? "is-active" : ""}`}
                  type="button"
                  aria-label="Vermelho"
                  onClick={() =>
                    setColorFilter(colorFilter === "vermelho" ? "todos" : "vermelho")
                  }
                ></button>

                <button
                  className={`color-dot color-beige ${colorFilter === "bege" ? "is-active" : ""}`}
                  type="button"
                  aria-label="Bege"
                  onClick={() =>
                    setColorFilter(colorFilter === "bege" ? "todos" : "bege")
                  }
                ></button>
                </div>
              </div>
            </aside>

            <section className="camisetas-content">
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
                      <button type="button" onClick={() => openProduct(product)}>
                        Saiba mais
                      </button>

                      <a
                        href={`https://wa.me/5541997485063?text=${encodeURIComponent(
                          `Olá! Tenho interesse na ${product.title}.`
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
                      className={`zoom-image-wrapper ${zoomLevel > 1 ? "is-draggable" : ""
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
      </main>
    </Layout>
  );
}

export default Camisetas;