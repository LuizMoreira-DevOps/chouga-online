import { useState } from "react";

import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";

import "../css/camisetas.css";

import camisetaBranca from "../assets/camisetas/camiseta-branca.jpeg";
import camisetaFlower from "../assets/camisetas/camiseta-flower.jpeg";
import camisetaLife from "../assets/camisetas/camiseta-life.jpeg";
import camisetaBomb from "../assets/camisetas/camiseta-bomb.jpeg";
import camisetaHoney from "../assets/camisetas/camiseta-honey.jpeg";
import camisetaPreta from "../assets/camisetas/camiseta-preta.jpeg";

const products = [
  {
    id: 1,
    image: camisetaBranca,
    title: "Camiseta Skateboard Branca",
    price: "R$ 150,00",
  },
  {
    id: 2,
    image: camisetaFlower,
    title: "Camiseta Flower",
    price: "R$ 150,00",
  },
  {
    id: 3,
    image: camisetaLife,
    title: "Camiseta Chouga Life",
    price: "R$ 150,00",
  },
  {
    id: 4,
    image: camisetaBomb,
    title: "Camiseta Chouga Bomb",
    price: "R$ 150,00",
  },
  {
    id: 5,
    image: camisetaHoney,
    title: "Camiseta Chouga Honey",
    price: "R$ 150,00",
  },
  {
    id: 6,
    image: camisetaPreta,
    title: "Camiseta Skateboard Preta",
    price: "R$ 150,00",
  },
];

function Camisetas() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <Layout>
      <main className="camisetas-page page-bg">
        <section className="camisetas-section page-section">
          <div className="camisetas-container page-container">
            <aside className="camisetas-sidebar">
              <span className="camisetas-breadcrumb">
                Home / Camiseta
              </span>

              <div className="filter-group">
                <h2>Categorias</h2>

                <button
                  className="filter-button is-active"
                  type="button"
                >
                  Todas
                </button>

                <button
                  className="filter-button"
                  type="button"
                >
                  Básicas
                </button>

                <button
                  className="filter-button"
                  type="button"
                >
                  Estampadas
                </button>

                <button
                  className="filter-button"
                  type="button"
                >
                  Colabs
                </button>
              </div>

              <div className="filter-divider"></div>

              <div className="filter-group">
                <h2>Tamanhos</h2>

                <div className="size-list">
                  <button type="button">P</button>
                  <button type="button">M</button>
                  <button type="button">G</button>
                  <button type="button">GG</button>
                  <button type="button">XG</button>
                </div>
              </div>

              <div className="filter-group">
                <h2>Cores</h2>

                <div className="color-list">
                  <button
                    className="color-dot color-black"
                    type="button"
                    aria-label="Preto"
                  ></button>

                  <button
                    className="color-dot color-gray"
                    type="button"
                    aria-label="Cinza"
                  ></button>

                  <button
                    className="color-dot color-white"
                    type="button"
                    aria-label="Branco"
                  ></button>

                  <button
                    className="color-dot color-red"
                    type="button"
                    aria-label="Vermelho"
                  ></button>

                  <button
                    className="color-dot color-beige"
                    type="button"
                    aria-label="Bege"
                  ></button>
                </div>
              </div>
            </aside>

            <section className="camisetas-content">
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    isSelected={
                      selectedProduct === product.id
                    }
                    isDimmed={
                      selectedProduct !== null &&
                      selectedProduct !== product.id
                    }
                    onClick={() =>
                      setSelectedProduct(
                        selectedProduct === product.id
                          ? null
                          : product.id
                      )
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Camisetas;