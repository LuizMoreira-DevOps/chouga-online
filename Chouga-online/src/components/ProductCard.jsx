import { Link } from "react-router-dom";

function formatProductCardTitle(productName) {
  return String(productName ?? "")
    .replace(/^Camiseta de Manga Longa\s+/i, "Manga Longa ")
    .trim();
}

function ProductCard({ product }) {
  const productTitle = product?.title || product?.nome || "Produto Chouga";
  const cardTitle = formatProductCardTitle(productTitle);

  if (!product?.slug) {
    console.error("Não foi possível abrir o produto: slug ausente.", product);

    return null;
  }

  return (
    <Link
      className="product-card"
      to={`/produtos/${product.slug}`}
      aria-label={`Ver detalhes de ${productTitle}`}
    >
      <div className="product-card-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt || productTitle}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="product-card-image-fallback">Imagem indisponível</div>
        )}

        <span className="product-card-view" aria-hidden="true">
          Ver detalhes
        </span>
      </div>

      <div className="product-card-content">
        <h3 title={productTitle}>{cardTitle}</h3>
        <p>{product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
