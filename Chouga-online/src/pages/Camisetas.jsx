import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductZoomModal from "../components/ProductZoomModal";
import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";
import BackToTop from "../components/BackToTop";

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
  { label: "Camisetas Básicas", value: "básicas" },
  { label: "Camisetas Estampadas", value: "estampadas" },
  { label: "Colabs", value: "colabs" },
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

function Camisetas() {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsProduct, setDetailsProduct] = useState(null);
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

  function openProductDetails(product) {
    setDetailsProduct(product);
  }

  function closeProductDetails() {
    setDetailsProduct(null);
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
        className={`camisetas-page page-bg ${selectedProduct || detailsProduct ? "is-zoom-open" : ""
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

            <section className="camisetas-content">
              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={openProduct}
                      onOpenDetails={openProductDetails}
                      whatsappPhone="5541997485063"
                    />
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

              <ProductZoomModal
                product={selectedProduct}
                zoomLevel={zoomLevel}
                dragPosition={dragPosition}
                onClose={closeProduct}
                onDecreaseZoom={decreaseZoom}
                onIncreaseZoom={increaseZoom}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onPointerLeave={stopDragging}
              />
            </section>
          </div>
        </section>

        <BackToTop />
      </main>
    </Layout>
  );
}

export default Camisetas;