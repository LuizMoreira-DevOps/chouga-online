const legacyImages = import.meta.glob(
  [
    "../assets/images/camisetas/*.{avif,gif,jpeg,jpg,png,svg,webp}",
    "../assets/images/blusas/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  ],
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
  "manga-longa": "manga-longa",
};

export function normalizeProductText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function normalizeCategorySlug(value) {
  return normalizeProductText(value)
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .split("-")
    .filter(Boolean)
    .map((part) => categoryAliases[part] ?? part)
    .join("-");
}

export function getProductCategorySlug(product) {
  return normalizeCategorySlug(
    product?.categoria_slug || product?.category || product?.categoria,
  );
}

function getAssetFolder(product) {
  const categorySlug = getProductCategorySlug(product);

  const isLongSleeve =
    categorySlug.includes("camisetas-manga-longa") ||
    categorySlug.includes("manga-longa") ||
    categorySlug.includes("blusas");

  return isLongSleeve ? "blusas" : "camisetas";
}

function getLegacyImage(imageUrl, assetFolder) {
  const normalizedImageUrl = String(imageUrl ?? "").replace(/^\/+/, "");

  const expectedSuffix = `/assets/images/${assetFolder}/${normalizedImageUrl}`;

  const imageEntry = Object.entries(legacyImages).find(([imagePath]) =>
    imagePath.endsWith(expectedSuffix),
  );

  return imageEntry?.[1] ?? "";
}

export function getCatalogProductImage(imageUrl, product) {
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

  return getLegacyImage(imageUrl, getAssetFolder(product));
}

export function normalizeCatalogProduct(product) {
  const images = Array.isArray(product?.imagens) ? product.imagens : [];
  const variations = Array.isArray(product?.variacoes) ? product.variacoes : [];

  const mainImage =
    images.find((image) => image.principal) ??
    [...images].sort(
      (firstImage, secondImage) =>
        Number(firstImage.ordem ?? 0) - Number(secondImage.ordem ?? 0),
    )[0];

  const colors = [
    ...new Set(
      variations
        .filter((variation) => variation.ativo !== false)
        .map((variation) => normalizeProductText(variation.cor))
        .filter(Boolean),
    ),
  ];

  const sizes = [
    ...new Set(
      variations
        .filter((variation) => variation.ativo !== false)
        .map((variation) => String(variation.tamanho ?? "").trim())
        .filter(Boolean),
    ),
  ];

  const categorySlug = getProductCategorySlug(product);

  return {
    ...product,
    title: product?.nome || "Produto Chouga",

    price: Number(product?.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),

    category: categorySlug || "sem-categoria",
    categoria_slug: categorySlug || "sem-categoria",

    colors,
    sizes,

    image: mainImage ? getCatalogProductImage(mainImage.url, product) : "",

    imageAlt: mainImage?.alt_text || product?.nome || "Produto Chouga",
  };
}

function getNormalizedTags(product) {
  return new Set(
    (Array.isArray(product?.tags) ? product.tags : [])
      .map(normalizeProductText)
      .filter(Boolean),
  );
}

function countSharedTags(currentProduct, candidateProduct) {
  const currentTags = getNormalizedTags(currentProduct);
  const candidateTags = getNormalizedTags(candidateProduct);

  let sharedTags = 0;

  candidateTags.forEach((tag) => {
    if (currentTags.has(tag)) {
      sharedTags += 1;
    }
  });

  return sharedTags;
}

function hasAvailableVariation(product) {
  const variations = Array.isArray(product?.variacoes) ? product.variacoes : [];

  if (variations.length === 0) {
    return true;
  }

  return variations.some((variation) => variation.ativo !== false);
}

export function getRelatedProducts(
  currentProduct,
  catalog,
  maximumProducts = 4,
) {
  if (!currentProduct || !Array.isArray(catalog)) {
    return [];
  }

  const currentCategory = getProductCategorySlug(currentProduct);

  return catalog
    .filter((candidate) => {
      const isCurrentProduct =
        candidate.id === currentProduct.id ||
        candidate.slug === currentProduct.slug;

      return (
        !isCurrentProduct &&
        candidate.ativo !== false &&
        hasAvailableVariation(candidate)
      );
    })
    .map((candidate) => {
      const sharedTags = countSharedTags(currentProduct, candidate);

      const sameCategory =
        getProductCategorySlug(candidate) === currentCategory;

      return {
        product: candidate,
        sharedTags,
        sameCategory,
        score: sharedTags * 10 + Number(sameCategory),
      };
    })
    .sort((firstCandidate, secondCandidate) => {
      if (secondCandidate.score !== firstCandidate.score) {
        return secondCandidate.score - firstCandidate.score;
      }

      return String(firstCandidate.product.nome ?? "").localeCompare(
        String(secondCandidate.product.nome ?? ""),
        "pt-BR",
      );
    })
    .slice(0, maximumProducts)
    .map(({ product }) => normalizeCatalogProduct(product));
}
