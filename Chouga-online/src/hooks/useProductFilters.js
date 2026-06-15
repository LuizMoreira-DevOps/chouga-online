import { useState } from "react";
import { filterProducts } from "../constants/productFilters";

function useProductFilters(products) {
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [colorFilter, setColorFilter] = useState("todos");
  const [searchFilter, setSearchFilter] = useState("");

  function toggleSizeFilter(size) {
    setSizeFilter((currentSize) => (currentSize === size ? "todos" : size));
  }

  function toggleColorFilter(color) {
    setColorFilter((currentColor) =>
      currentColor === color ? "todos" : color,
    );
  }

  function clearFilters() {
    setCategoryFilter("todos");
    setSizeFilter("todos");
    setColorFilter("todos");
    setSearchFilter("");
  }

  const filteredProducts = filterProducts(
    products,
    categoryFilter,
    sizeFilter,
    colorFilter,
    searchFilter,
  );

  return {
    categoryFilter,
    sizeFilter,
    colorFilter,
    searchFilter,
    filteredProducts,
    setCategoryFilter,
    setSearchFilter,
    toggleSizeFilter,
    toggleColorFilter,
    clearFilters,
  };
}

export default useProductFilters;
