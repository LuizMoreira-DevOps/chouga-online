import { useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import ProductZoomModal from "../components/ProductZoomModal";
import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";
import BackToTop from "../components/BackToTop";

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
        className={`blusas-page page-bg ${
          selectedProduct || detailsProduct ? "is-zoom-open" : ""
        }`}
      >
        <section className="blusas-section page-section">
          <div className="blusas-container page-container">
            <ProductFilters
              page="blusas"
              breadcrumbLabel="Blusas"
              breadcrumbPath="/blusas"
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sizes={["P", "M", "G", "GG", "XG"]}
              sizeFilter={sizeFilter}
              onSizeToggle={toggleSizeFilter}
              availableColors={availableColors}
              colorOptions={colorOptions}
              colorFilter={colorFilter}
              onColorToggle={toggleColorFilter}
            />

            <section className="blusas-content">
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

export default Blusas;