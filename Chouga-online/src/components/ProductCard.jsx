function ProductCard({
  image,
  title,
  price,
  isSelected,
  isDimmed,
  onClick,
}) {
  return (
    <article
      className={`
        product-card
        ${isSelected ? "selected" : ""}
        ${isDimmed ? "dimmed" : ""}
      `}
      onClick={onClick}
    >
      <div className="product-image">
        <img src={image} alt={title} />
      </div>

      <div className="product-info">
        <h3>{title}</h3>
        <span>{price}</span>
      </div>
    </article>
  );
}

export default ProductCard;