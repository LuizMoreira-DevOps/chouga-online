import { getColorOption } from "../constants/productFilters";
import "../css/productFilters.css";

function ProductFilters({
  categories,
  categoryFilter,
  onCategoryChange,
  sizes,
  sizeFilter,
  onSizeToggle,
  availableColors,
  colorFilter,
  onColorToggle,
}) {
  const hasCategories = categories.length > 1;
  const hasSizes = sizes.length > 0;
  const hasColors = availableColors.length > 0;

  return (
    <aside className="product-filters" aria-label="Filtros de produtos">
      {hasCategories && (
        <>
          <div className="filter-group">
            <h2>Categorias</h2>

            <div className="category-list">
              {categories.map((category) => {
                const isActive = categoryFilter === category.value;

                return (
                  <button
                    key={category.value}
                    className={`filter-button ${isActive ? "is-active" : ""}`}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(hasSizes || hasColors) && (
            <div className="filter-divider" aria-hidden="true" />
          )}
        </>
      )}

      {hasSizes && (
        <div className="filter-group">
          <h2>Tamanhos</h2>

          <div className="size-list">
            {sizes.map((size) => {
              const isActive = sizeFilter === size;

              return (
                <button
                  key={size}
                  className={isActive ? "is-active" : ""}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSizeToggle(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasColors && (
        <div className="filter-group">
          <h2>Cores</h2>

          <div className="color-list">
            {availableColors.map((color) => {
              const option = getColorOption(color);
              const isActive = colorFilter === color;

              return (
                <button
                  key={color}
                  className={`color-dot ${option.className} ${
                    isActive ? "is-active" : ""
                  }`}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={isActive}
                  title={option.label}
                  onClick={() => onColorToggle(color)}
                />
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProductFilters;
