import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";

import blusasData from "../data/blusas.json";

import "../css/blusas.css";

const imageFiles = {
  blusaBomb: "blusa-chouga-bomb.jpeg",
  blusaCity: "blusa-chouga-city.jpeg",
  blusaSkull: "blusa-chouga-skull.jpeg",
  blusaWheel: "blusa-chouga-wheel.jpeg",
};

function getProductImage(imageKey) {
  return new URL(
    `../assets/images/blusas/${imageFiles[imageKey]}`,
    import.meta.url,
  ).href;
}

const products = blusasData.map((product) => ({
  ...product,
  image: getProductImage(product.imageKey),
}));

const categories = [
  { label: "Todas", value: "todos" },
  { label: "Blusas estampadas", value: "estampadas" },
];

const colorOptions = {
  preto: {
    label: "Preto",
    className: "color-black",
  },
  cinza: {
    label: "Cinza",
    className: "color-gray",
  },
  branco: {
    label: "Branco",
    className: "color-white",
  },
  vermelho: {
    label: "Vermelho",
    className: "color-red",
  },
  bege: {
    label: "Bege",
    className: "color-beige",
  },
  azul: {
    label: "Azul",
    className: "color-blue",
  },
};

const availableColors = [
  ...new Set(products.flatMap((product) => product.colors)),
].filter((color) => colorOptions[color]);

function Blusas() {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 320);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function openProduct(product) {
    setSelectedProduct(product);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    setDragStart(null);
  }

  function openProductDetails(product) {
    setDetailsProduct(product);
  }

  function closeProductDetails() {
    setDetailsProduct(null);
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
        className={`blusas-page page-bg ${selectedProduct || detailsProduct ? "is-zoom-open" : ""
          }`}
      >
        <section className="blusas-section page-section">
          <div className="blusas-container page-container">
            <aside className="blusas-sidebar">
              <nav className="blusas-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/blusas">Blusas</Link>
              </nav>

              <div className="filter-group">
                <h2>Categorias</h2>

                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`filter-button ${categoryFilter === category.value ? "is-active" : ""
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
                  {availableColors.map((color) => {
                    const option = colorOptions[color];

                    return (
                      <button
                        key={color}
                        className={`color-dot ${option.className} ${colorFilter === color ? "is-active" : ""
                          }`}
                        type="button"
                        aria-label={option.label}
                        title={option.label}
                        onClick={() => toggleColorFilter(color)}
                      ></button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section className="blusas-content">
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

                          <span className="product-zoom-hint" aria-hidden="true">
                            <FiSearch />
                          </span>
                        </div>

                        <div className="product-info">
                          <h3>{product.title}</h3>
                          <span>{product.price}</span>
                        </div>
                      </button>

                      <div className="product-actions">
                        <button
                          type="button"
                          onClick={() => openProductDetails(product)}
                        >
                          Ver produto
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

              {detailsProduct && (
                <ProductDetailsModal
                  product={detailsProduct}
                  onClose={closeProductDetails}
                  whatsappPhone="5541997485063"
                />
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
                    <button
                      className="zoom-close"
                      type="button"
                      onClick={closeProduct}
                      aria-label="Fechar zoom"
                    >
                      ×
                    </button>

                    <div className="zoom-controls">
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

        {showBackToTop && (
          <button
            className="back-to-top"
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
          >
            ↑
          </button>
        )}
      </main>
    </Layout>
  );
}

export default Blusas;