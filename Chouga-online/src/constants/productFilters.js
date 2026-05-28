export const productSizes = ["P", "M", "G", "GG", "XG"];

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

export function getAvailableColors(products) {
    return [...new Set(products.flatMap((product) => product.colors))].filter(
        (color) => colorOptions[color],
    );
}