import { useState } from "react";
import { filterProducts } from "../constants/productFilters";

function useProductFilters(products) {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");

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

  return {
    categoryFilter,
    sizeFilter,
    colorFilter,
    filteredProducts,
    setCategoryFilter,
    toggleSizeFilter,
    toggleColorFilter,
  };
}

export default useProductFilters;
