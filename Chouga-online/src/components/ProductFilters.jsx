import { Link } from "react-router-dom";

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
  colorOptions,
  colorFilter,
  onColorToggle,
}) {
  return (
    <aside className={`${page}-sidebar`}>
      <nav className={`${page}-breadcrumb`} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={breadcrumbPath}>{breadcrumbLabel}</Link>
      </nav>

      <div className="filter-group">
        <h2>Categorias</h2>

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

      <div className="filter-divider"></div>

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

      <div className="filter-group">
        <h2>Cores</h2>

        <div className="color-list">
          {availableColors.map((color) => {
            const option = colorOptions[color];

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
    </aside>
  );
}

export default ProductFilters;