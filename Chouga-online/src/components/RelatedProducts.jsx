import { useEffect, useMemo, useState } from "react";

import ProductCard from "./ProductCard";

import { getProdutosCatalogo } from "../services/produtosServices";

import { getRelatedProducts } from "../utils/productCatalog";

import "../css/products.css";
import "../css/relatedProducts.css";

const MAX_RELATED_PRODUCTS = 4;

function RelatedProducts({ currentProduct }) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        setError("");

        const catalogData = await getProdutosCatalogo();

        if (isMounted) {
          setCatalog(catalogData);
        }
      } catch (loadError) {
        console.error("Erro ao carregar produtos relacionados:", loadError);

        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar os produtos relacionados.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const relatedProducts = useMemo(
    () => getRelatedProducts(currentProduct, catalog, MAX_RELATED_PRODUCTS),
    [currentProduct, catalog],
  );

  if (loading || error || !currentProduct || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section
      className="related-products"
      aria-labelledby="related-products-title"
    >
      <div className="related-products-heading">
        <span>Continue explorando</span>

        <h2 id="related-products-title">Você também pode gostar</h2>
      </div>

      <div className="related-products-list">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard
            key={relatedProduct.id || relatedProduct.slug}
            product={relatedProduct}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
