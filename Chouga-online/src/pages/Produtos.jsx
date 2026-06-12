import { useEffect, useMemo, useState } from "react";
import BackToTop from "../components/BackToTop";
import Layout from "../components/Layout";
import ProductDetailsModal from "../components/ProductDetailsModal";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import ProductZoomModal from "../components/ProductZoomModal";
import {
  getAvailableColors,
  getAvailableSizes,
  getDynamicCategories,
} from "../constants/productFilters";
import useProductFilters from "../hooks/useProductFilters";
import useProductZoom from "../hooks/useProductZoom";
import { getProdutosCatalogo } from "../services/produtosServices";

import "../css/camisetas.css";
import "../css/blusas.css";

const legacyImages = import.meta.glob(
  "../assets/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  {
    eager: true,
    import: "default",
  },
);

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getLegacyImage(imageUrl, assetFolder) {
  const expectedSuffix = `/assets/images/${assetFolder}/${imageUrl}`;
  const imageEntry = Object.entries(legacyImages).find(([path]) =>
    path.endsWith(expectedSuffix),
  );

  return imageEntry?.[1] ?? "";
}

function getProductImage(imageUrl, assetFolder) {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    return `${strapiUrl}${imageUrl}`;
  }

  return getLegacyImage(imageUrl, assetFolder);
}

function belongsToGroup(product, groupSlug) {
  const categorySlug = normalizeText(product.categoria_slug);
  const normalizedGroupSlug = normalizeText(groupSlug);

  return (
    categorySlug === normalizedGroupSlug ||
    categorySlug.startsWith(`${normalizedGroupSlug}-`)
  );
}

function normalizeProduct(product, assetFolder) {
  const mainImage =
    product.imagens?.find((image) => image.principal) ?? product.imagens?.[0];

  const colors = [
    ...new Set(
      product.variacoes
        ?.map((variation) => normalizeText(variation.cor))
        .filter(Boolean),
    ),
  ];

  const sizes = [
    ...new Set(
      product.variacoes
        ?.map((variation) => String(variation.tamanho ?? "").trim())
        .filter(Boolean),
    ),
  ];

  return {
    ...product,
    title: product.nome,
    price: `R$ ${Number(product.preco).toFixed(2).replace(".", ",")}`,
    category: product.categoria_slug || "sem-categoria",
    colors,
    sizes,
    image: mainImage ? getProductImage(mainImage.url, assetFolder) : "",
    imageAlt: mainImage?.alt_text || product.nome,
  };
}

function Produtos({
  groupSlug,
  pageClass,
  title,
  path,
  assetFolder = groupSlug,
  whatsappPhone = "5541997485063",
}) {
  const [products, setProducts] = useState([]);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const availableColors = useMemo(
    () => getAvailableColors(products),
    [products],
  );
  const availableSizes = useMemo(
    () => getAvailableSizes(products),
    [products],
  );
  const categories = useMemo(
    () => getDynamicCategories(products, title),
    [products, title],
  );

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

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const catalog = await getProdutosCatalogo();
        const groupProducts = catalog
          .filter((product) => belongsToGroup(product, groupSlug))
          .map((product) => normalizeProduct(product, assetFolder));

        if (isMounted) {
          setProducts(groupProducts);
        }
      } catch (loadError) {
        console.error(`Erro ao carregar ${title.toLowerCase()}:`, loadError);

        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [assetFolder, groupSlug, title]);

  return (
    <Layout>
      <main
        className={`${pageClass}-page page-bg ${
          selectedProduct || detailsProduct ? "is-zoom-open" : ""
        }`}
      >
        <section className={`${pageClass}-section page-section`}>
          <div className={`${pageClass}-container page-container`}>
            <ProductFilters
              page={pageClass}
              breadcrumbLabel={title}
              breadcrumbPath={path}
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sizes={availableSizes}
              sizeFilter={sizeFilter}
              onSizeToggle={toggleSizeFilter}
              availableColors={availableColors}
              colorFilter={colorFilter}
              onColorToggle={toggleColorFilter}
            />

            <section className={`${pageClass}-content`}>
              {loading && <p>Carregando produtos...</p>}

              {error && <p>Erro ao carregar produtos: {error}</p>}

              {!loading && !error && (
                <ProductGrid
                  products={filteredProducts}
                  onOpenProduct={openProduct}
                  onOpenProductDetails={setDetailsProduct}
                />
              )}

              {detailsProduct && (
                <ProductDetailsModal
                  product={detailsProduct}
                  onClose={() => setDetailsProduct(null)}
                  whatsappPhone={whatsappPhone}
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

export default Produtos;
