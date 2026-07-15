import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  function openProductDetails() {
    if (!product?.slug) {
      console.error("Não foi possível abrir o produto: slug ausente.", product);

      return;
    }

    navigate(`/produtos/${product.slug}`);
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openProductDetails();
  }

  return (
    <article
      className="product-card"
      role="link"
      tabIndex={0}
      aria-label={`Ver detalhes de ${product.title}`}
      onClick={openProductDetails}
      onKeyDown={handleKeyDown}
    >
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.imageAlt || product.title} />
        ) : (
          <div className="product-card-image-fallback">Imagem indisponível</div>
        )}

        <span className="product-card-view" aria-hidden="true">
          Ver detalhes
        </span>
      </div>

      <div className="product-card-content">
        <h3>{product.title}</h3>
        <p>{product.price}</p>
      </div>
    </article>
  );
}

export default ProductCard;
