import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="products-empty">
        Nenhum produto encontrado nessa categoria.
      </p>
    );
  }

  return (
    <section className="products-grid" aria-label="Lista de produtos">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index === 0}
        />
      ))}
    </section>
  );
}

export default ProductGrid;
