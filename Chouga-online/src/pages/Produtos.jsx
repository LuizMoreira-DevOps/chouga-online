import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BackToTop from "../components/BackToTop";
import Layout from "../components/Layout";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";

import {
  getAvailableColors,
  getAvailableSizes,
  getDynamicCategories,
} from "../constants/productFilters";

import useProductFilters from "../hooks/useProductFilters";
import { getProdutosCatalogo } from "../services/produtosServices";

import "../css/products.css";
import "../css/camisetas.css";
import "../css/blusas.css";

const legacyImages = import.meta.glob(
  "../assets/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  {
    eager: true,
    import: "default",
  },
);

const categoryAliases = {
  camiseta: "camisetas",
  camisetas: "camisetas",
  cropped: "cropped",
  croppeds: "cropped",
  blusa: "blusas",
  blusas: "blusas",
};

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

function getAssetFolder(product) {
  const categorySlug = getProductCategorySlug(product);

  const categoryParts = categorySlug.split("-");

  if (categoryParts.includes("blusas")) {
    return "blusas";
  }

  return "camisetas";
}

function getLegacyImage(imageUrl, assetFolder) {
  const normalizedImageUrl = String(imageUrl ?? "").replace(/^\/+/, "");

  const expectedSuffix = `/assets/images/${assetFolder}/${normalizedImageUrl}`;

  const imageEntry = Object.entries(legacyImages).find(([imagePath]) =>
    imagePath.endsWith(expectedSuffix),
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
    const strapiUrl =
      import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    return `${strapiUrl}${imageUrl}`;
  }

  return getLegacyImage(imageUrl, assetFolder);
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

function normalizeProduct(product) {
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

  const categorySlug = getProductCategorySlug(product);

  const assetFolder = getAssetFolder(product);

  return {
    ...product,
    title: product.nome,
    price: Number(product.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    category: categorySlug || "sem-categoria",
    categoria_slug: categorySlug || "sem-categoria",
    colors,
    sizes,
    image: mainImage ? getProductImage(mainImage.url, assetFolder) : "",
    imageAlt: mainImage?.alt_text || product.nome,
  };
}

function Produtos({
  categoryGroups = ["camisetas", "cropped", "blusas"],
  pageClass = "camisetas",
  title = "Produtos",
  path = "/produtos",
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

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const catalog = await getProdutosCatalogo();

        const normalizedProducts = catalog
          .filter((product) => belongsToCategoryGroups(product, categoryGroups))
          .map(normalizeProduct);

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
    if (products.length === 0) {
      return;
    }

    const requestedCategory = normalizeCategorySlug(
      searchParams.get("categoria"),
    );

    if (!requestedCategory) {
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
  }, [categories, products, searchParams, setCategoryFilter]);

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
      <main className={`${pageClass}-page page-bg`}>
        <section className={`${pageClass}-section page-section`}>
          <div className={`${pageClass}-container page-container`}>
            <ProductFilters
              page={pageClass}
              breadcrumbLabel={title}
              breadcrumbPath={path}
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

            <section className={`${pageClass}-content`}>
              {loading && <p>Carregando produtos...</p>}

              {error && <p>Erro ao carregar produtos: {error}</p>}

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
