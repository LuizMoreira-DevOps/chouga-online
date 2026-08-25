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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

export default ProductGrid;
