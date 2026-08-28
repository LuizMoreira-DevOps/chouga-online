import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BackToTop from "../components/BackToTop";
import Layout from "../components/Layout";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";

import { normalizeCatalogProduct } from "../utils/productCatalog";

import {
  getAvailableColors,
  getAvailableSizes,
  getDynamicCategories,
} from "../constants/productFilters";

import useProductFilters from "../hooks/useProductFilters";
import { getProdutosCatalogo } from "../services/produtosServices";

import "../css/products.css";

const categoryAliases = {
  camiseta: "camisetas",
  camisetas: "camisetas",
  cropped: "cropped",
  croppeds: "cropped",
  blusa: "blusas",
  blusas: "blusas",
  "manga-longa": "manga-longa",
};

const DEFAULT_CATEGORY_GROUPS = [
  "camisetas",
  "cropped",
  "camisetas-manga-longa",
  "blusas",
];

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeCategorySlug(value) {
  return normalizeText(value)
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .split("-")
    .filter(Boolean)
    .map((part) => categoryAliases[part] ?? part)
    .join("-");
}

function getProductCategorySlug(product) {
  return normalizeCategorySlug(
    product.categoria_slug || product.category || product.categoria,
  );
}

function belongsToCategoryGroups(product, categoryGroups) {
  const categorySlug = getProductCategorySlug(product);
  const categoryParts = categorySlug.split("-");

  return categoryGroups.some((group) => {
    const normalizedGroup = normalizeCategorySlug(group);

    return (
      categorySlug === normalizedGroup ||
      categorySlug.startsWith(`${normalizedGroup}-`) ||
      categoryParts.includes(normalizedGroup)
    );
  });
}

function Produtos({
  categoryGroups = DEFAULT_CATEGORY_GROUPS,
  title = "Produtos",
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    categoryFilter,
    sizeFilter,
    colorFilter,
    filteredProducts,
    setCategoryFilter,
    toggleSizeFilter,
    toggleColorFilter,
  } = useProductFilters(products);

  const availableColors = useMemo(
    () => getAvailableColors(products),
    [products],
  );

  const availableSizes = useMemo(() => getAvailableSizes(products), [products]);

  const categories = useMemo(
    () => getDynamicCategories(products, title),
    [products, title],
  );

  const requestedCategory = useMemo(
    () => normalizeCategorySlug(searchParams.get("categoria")),
    [searchParams],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const catalog = await getProdutosCatalogo();

        const normalizedProducts = catalog
          .filter((product) => belongsToCategoryGroups(product, categoryGroups))
          .map(normalizeCatalogProduct);

        if (isMounted) {
          setProducts(normalizedProducts);
        }
      } catch (loadError) {
        console.error("Erro ao carregar produtos:", loadError);

        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar os produtos.",
          );
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
  }, [categoryGroups]);

  useEffect(() => {
    if (products.length === 0 || !requestedCategory) {
      return;
    }

    const matchingCategory = categories.find((category) => {
      const categoryValue = normalizeCategorySlug(category.value);
      const categoryParts = categoryValue.split("-");

      return (
        categoryValue === requestedCategory ||
        categoryValue.startsWith(`${requestedCategory}-`) ||
        categoryParts.includes(requestedCategory)
      );
    });

    if (matchingCategory) {
      setCategoryFilter(matchingCategory.value);
    }
  }, [categories, products.length, requestedCategory, setCategoryFilter]);

  function handleCategoryChange(category) {
    setCategoryFilter(category);

    if (category === "todos") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      categoria: normalizeCategorySlug(category),
    });
  }

  return (
    <Layout>
      <main className="produtos-page page-bg">
        <section className="produtos-section page-section">
          <div className="produtos-container page-container">
            <ProductFilters
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
              sizes={availableSizes}
              sizeFilter={sizeFilter}
              onSizeToggle={toggleSizeFilter}
              availableColors={availableColors}
              colorFilter={colorFilter}
              onColorToggle={toggleColorFilter}
            />

            <section
              className="produtos-content"
              aria-label="Catálogo de produtos"
              aria-busy={loading}
            >
              {loading && <p role="status">Carregando produtos...</p>}

              {error && <p role="alert">Erro ao carregar produtos: {error}</p>}

              {!loading && !error && (
                <ProductGrid products={filteredProducts} />
              )}
            </section>
          </div>
        </section>

        <BackToTop />
      </main>
    </Layout>
  );
}

export default Produtos;
