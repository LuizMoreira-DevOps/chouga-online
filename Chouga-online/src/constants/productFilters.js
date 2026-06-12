function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function formatLabel(value) {
  const text = String(value ?? "").trim();

  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

const sizeOrder = ["RN", "PP", "P", "M", "G", "GG", "XG", "XGG", "XXG", "XXXG"];

export const colorOptions = {
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

export function getColorOption(color) {
  const normalizedColor = normalizeText(color);

  return (
    colorOptions[normalizedColor] ?? {
      label: formatLabel(color),
      className: "color-custom",
    }
  );
}

export function getDynamicCategories(products, fallbackLabel = "Produtos") {
  const categories = products
    .filter((product) => product.category)
    .map((product) => ({
      label: product.categoria || fallbackLabel,
      value: product.category,
    }));

  const uniqueCategories = Array.from(
    new Map(
      categories.map((category) => [normalizeText(category.value), category]),
    ).values(),
  );

  return [{ label: "Todas", value: "todos" }, ...uniqueCategories];
}

export function sortProductSizes(sizes) {
  return [...sizes].sort((firstSize, secondSize) => {
    const firstValue = String(firstSize).trim().toUpperCase();
    const secondValue = String(secondSize).trim().toUpperCase();

    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);

    const firstIsNumber = Number.isFinite(firstNumber);
    const secondIsNumber = Number.isFinite(secondNumber);

    if (firstIsNumber && secondIsNumber) {
      return firstNumber - secondNumber;
    }

    if (firstIsNumber) {
      return 1;
    }

    if (secondIsNumber) {
      return -1;
    }

    const firstIndex = sizeOrder.indexOf(firstValue);
    const secondIndex = sizeOrder.indexOf(secondValue);

    if (firstIndex !== -1 && secondIndex !== -1) {
      return firstIndex - secondIndex;
    }

    if (firstIndex !== -1) {
      return -1;
    }

    if (secondIndex !== -1) {
      return 1;
    }

    return firstValue.localeCompare(secondValue, "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
  });
}

export function getAvailableSizes(products) {
  const sizes = [
    ...new Set(
      products
        .flatMap((product) =>
          Array.isArray(product.sizes) ? product.sizes : [],
        )
        .filter(Boolean),
    ),
  ];

  return sortProductSizes(sizes);
}

export function getAvailableColors(products) {
  return [
    ...new Set(
      products
        .flatMap((product) =>
          Array.isArray(product.colors) ? product.colors : [],
        )
        .filter(Boolean),
    ),
  ];
}

export function filterProducts(
  products,
  categoryFilter,
  sizeFilter,
  colorFilter,
) {
  return products.filter((product) => {
    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];

    const productColors = Array.isArray(product.colors) ? product.colors : [];

    const matchCategory =
      categoryFilter === "todos" ||
      normalizeText(product.category) === normalizeText(categoryFilter);

    const matchSize =
      sizeFilter === "todos" ||
      productSizes.some(
        (size) => normalizeText(size) === normalizeText(sizeFilter),
      );

    const matchColor =
      colorFilter === "todos" ||
      productColors.some(
        (color) => normalizeText(color) === normalizeText(colorFilter),
      );

    return matchCategory && matchSize && matchColor;
  });
}
