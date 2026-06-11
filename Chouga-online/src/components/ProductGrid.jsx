import ProductCard from "./ProductCard";

function ProductGrid({ products, onOpenProduct, onOpenProductDetails }) {
  if (products.length === 0) {
    return (
      <p className="products-empty">
        Nenhum produto encontrado nessa categoria.
      </p>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpen={onOpenProduct}
          onOpenDetails={onOpenProductDetails}
        />
      ))}
    </div>
  );
}

export default ProductGrid;