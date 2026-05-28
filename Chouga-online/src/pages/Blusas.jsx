import { useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import ProductZoomModal from "../components/ProductZoomModal";
import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";
import BackToTop from "../components/BackToTop";
import {
  colorOptions,
  filterProducts,
  getAvailableColors,
  productSizes,
} from "../constants/productFilters";
import blusasData from "../data/blusas.json";
import useProductZoom from "../hooks/useProductZoom";

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

const availableColors = getAvailableColors(products);

function Blusas() {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");
  const [detailsProduct, setDetailsProduct] = useState(null);

  const {
    selectedProduct,
    zoomLevel,
    dragPosition,
    openProduct,
    closeProduct,
    decreaseZoom,
    increaseZoom,
    handlePointerDown,
    handlePointerMove,
    stopDragging,
  } = useProductZoom();

  function openProductDetails(product) {
    setDetailsProduct(product);
  }

  function closeProductDetails() {
    setDetailsProduct(null);
  }

  function toggleSizeFilter(size) {
    setSizeFilter((currentSize) => (currentSize === size ? "todos" : size));
  }

  function toggleColorFilter(color) {
    setColorFilter((currentColor) =>
      currentColor === color ? "todos" : color,
    );
  }

  const filteredProducts = filterProducts(
    products,
    categoryFilter,
    sizeFilter,
    colorFilter,
  );

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
              sizes={productSizes}
              sizeFilter={sizeFilter}
              onSizeToggle={toggleSizeFilter}
              availableColors={availableColors}
              colorOptions={colorOptions}
              colorFilter={colorFilter}
              onColorToggle={toggleColorFilter}
            />

            <section className="blusas-content">
              <ProductGrid
                products={filteredProducts}
                onOpenProduct={openProduct}
                onOpenProductDetails={openProductDetails}
                whatsappPhone="5541997485063"
              />

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