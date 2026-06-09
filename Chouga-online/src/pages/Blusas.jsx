import { useEffect, useState } from "react";
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
import { getProdutosCatalogo } from "../services/produtosServices";

import "../css/blusas.css";

function getProductImage(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    return `${strapiUrl}${imageUrl}`;
  }

  return new URL(`../assets/images/blusas/${imageUrl}`, import.meta.url).href;
}

function isBlusaProduct(product) {
  return product.categoria_slug?.startsWith("blusas");
}

function formatCategoryLabel(category) {
  return category || "Blusas";
}

function getDynamicCategories(products) {
  const categoryOptions = products
    .filter((product) => product.categoria_slug)
    .map((product) => ({
      label: formatCategoryLabel(product.categoria),
      value: product.categoria_slug,
    }));

  const uniqueCategoryOptions = Array.from(
    new Map(
      categoryOptions.map((category) => [category.value, category]),
    ).values(),
  );

  return [{ label: "Todas", value: "todos" }, ...uniqueCategoryOptions];
}

function getProductCategory(product) {
  if (product.categoria_slug) {
    return product.categoria_slug;
  }

  const tags = product.tags || [];

  if (tags.includes("Colab")) {
    return "colabs";
  }

  if (tags.includes("Básica")) {
    return "basicas";
  }

  if (tags.includes("Estampada")) {
    return "estampadas";
  }

  return "blusas";
}

function normalizeProduct(product) {
  const mainImage =
    product.imagens?.find((image) => image.principal) || product.imagens?.[0];

  const colors = [
    ...new Set(
      product.variacoes
        ?.map((variation) => variation.cor?.toLowerCase())
        .filter(Boolean),
    ),
  ];

  const sizes = [
    ...new Set(
      product.variacoes
        ?.map((variation) => variation.tamanho)
        .filter(Boolean),
    ),
  ];

  return {
    ...product,
    title: product.nome,
    price: `R$ ${Number(product.preco).toFixed(2).replace(".", ",")}`,
    category: getProductCategory(product),
    colors,
    sizes,
    image: mainImage ? getProductImage(mainImage.url) : "",
    imageAlt: mainImage?.alt_text || product.nome,
  };
}

function Blusas() {
  const [products, setProducts] = useState([]);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const availableColors = getAvailableColors(products);

  const categories = getDynamicCategories(products);

  const availableSizes = productSizes.filter((size) => {
    const sizeValue = typeof size === "string" ? size : size.value;

    return products.some((product) =>
      product.sizes?.some(
        (productSize) =>
          productSize.toLowerCase() === sizeValue?.toLowerCase(),
      ),
    );
  });

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

  function openProductDetails(product) {
    setDetailsProduct(product);
  }

  function closeProductDetails() {
    setDetailsProduct(null);
  }

  useEffect(() => {
    async function loadProdutos() {
      try {
        const produtos = await getProdutosCatalogo();

        const blusas = produtos.filter(isBlusaProduct).map(normalizeProduct);

        setProducts(blusas);
      } catch (loadError) {
        console.error("Erro ao carregar blusas:", loadError);
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProdutos();
  }, []);

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
              sizes={availableSizes}
              sizeFilter={sizeFilter}
              onSizeToggle={toggleSizeFilter}
              availableColors={availableColors}
              colorOptions={colorOptions}
              colorFilter={colorFilter}
              onColorToggle={toggleColorFilter}
            />

            <section className="blusas-content">
              {loading && <p>Carregando produtos...</p>}

              {error && <p>Erro ao carregar produtos: {error}</p>}

              {!loading && !error && (
                <ProductGrid
                  products={filteredProducts}
                  onOpenProduct={openProduct}
                  onOpenProductDetails={openProductDetails}
                  whatsappPhone="5541997485063"
                />
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