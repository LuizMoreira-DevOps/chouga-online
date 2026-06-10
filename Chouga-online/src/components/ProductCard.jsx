import { FiSearch } from "react-icons/fi";

function ProductCard({ product, onOpen, onOpenDetails }) {
  return (
    <article className="product-card">
      <button
        className="product-card-button"
        type="button"
        onClick={() => onOpen(product)}
      >
        <div className="product-image">
          <img src={product.image} alt={product.title} />

          <span className="product-zoom-hint" aria-hidden="true">
            <FiSearch />
          </span>
        </div>

        <div className="product-info">
          <h3>{product.title}</h3>
          <span>{product.price}</span>
        </div>
      </button>

      <div className="product-actions">
        <button type="button" onClick={() => onOpenDetails(product)}>
          Ver produto
        </button>
      </div>
    </article>
  );
}

export default ProductCard;