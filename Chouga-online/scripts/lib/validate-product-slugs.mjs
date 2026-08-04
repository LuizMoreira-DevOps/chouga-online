const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function describeProduct(product) {
  const name = String(product?.nome ?? "").trim();
  const id = String(product?.id ?? "").trim();

  if (name && id) {
    return `${name} (${id})`;
  }

  return name || id || "produto sem identificacao";
}

export function validateProductSlugs(products) {
  if (!Array.isArray(products)) {
    throw new TypeError(
      "A lista de produtos usada pelo SSG deve ser um array.",
    );
  }

  const validatedProducts = [];
  const usedSlugs = new Set();

  for (const product of products) {
    const slug = String(product?.slug ?? "").trim();
    const productLabel = describeProduct(product);

    if (!slug) {
      throw new Error(
        `Produto ativo sem slug valido: ${productLabel}.`,
      );
    }

    if (!validSlugPattern.test(slug)) {
      throw new Error(
        `Slug invalido no produto ${productLabel}: "${slug}".`,
      );
    }

    if (usedSlugs.has(slug)) {
      throw new Error(
        `Slug duplicado encontrado no catalogo ativo: "${slug}".`,
      );
    }

    usedSlugs.add(slug);
    validatedProducts.push({
      ...product,
      slug,
    });
  }

  return validatedProducts;
}