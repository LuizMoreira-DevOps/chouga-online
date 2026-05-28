import { useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import ProductZoomModal from "../components/ProductZoomModal";
import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";
import BackToTop from "../components/BackToTop";
import {
  colorOptions,
  getAvailableColors,
  productSizes,
} from "../constants/productFilters";
import useProductFilters from "../hooks/useProductFilters";
import useProductZoom from "../hooks/useProductZoom";

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

const availableColors = getAvailableColors(products);

function Camisetas() {
  const [detailsProduct, setDetailsProduct] = useState(null);

  function openProductDetails(product) {
    setDetailsProduct(product);
  }

  function closeProductDetails() {
    setDetailsProduct(null);
  }

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

  const {
    categoryFilter,
    sizeFilter,
    colorFilter,
    filteredProducts,
    setCategoryFilter,
    toggleSizeFilter,
    toggleColorFilter,
  } = useProductFilters(products);

  return (
    <Layout>
      <main
        className={`camisetas-page page-bg ${
          selectedProduct || detailsProduct ? "is-zoom-open" : ""
        }`}
      >
        <section className="camisetas-section page-section">
          <div className="camisetas-container page-container">
            <ProductFilters
              page="camisetas"
              breadcrumbLabel="Camiseta"
              breadcrumbPath="/camisetas"
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

            <section className="camisetas-content">
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

export default Camisetas;