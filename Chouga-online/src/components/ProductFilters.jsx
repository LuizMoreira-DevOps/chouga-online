import { Link } from "react-router-dom";
import { getColorOption } from "../constants/productFilters";

function ProductFilters({
  page,
  breadcrumbLabel,
  breadcrumbPath,
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
    <aside className={`${page}-sidebar`}>
      <nav className={`${page}-breadcrumb`} aria-label="Breadcrumb">
        <Link to="/">Home</Link>

        <span>/</span>

        <Link to={breadcrumbPath}>{breadcrumbLabel}</Link>
      </nav>

      {hasCategories && (
        <>
          <div className="filter-group">
            <h2>Categorias</h2>

            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={`filter-button ${
                    categoryFilter === category.value ? "is-active" : ""
                  }`}
                  type="button"
                  onClick={() => onCategoryChange(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {(hasSizes || hasColors) && (
            <div className="filter-divider"></div>
          )}
        </>
      )}

      {hasSizes && (
        <div className="filter-group">
          <h2>Tamanhos</h2>

          <div className="size-list">
            {sizes.map((size) => (
              <button
                key={size}
                className={sizeFilter === size ? "is-active" : ""}
                type="button"
                onClick={() => onSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasColors && (
        <div className="filter-group">
          <h2>Cores</h2>

          <div className="color-list">
            {availableColors.map((color) => {
              const option = getColorOption(color);

              return (
                <button
                  key={color}
                  className={`color-dot ${option.className} ${
                    colorFilter === color ? "is-active" : ""
                  }`}
                  type="button"
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => onColorToggle(color)}
                ></button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProductFilters;