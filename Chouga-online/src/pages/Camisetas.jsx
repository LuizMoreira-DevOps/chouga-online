import { Link } from "react-router-dom";
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  function openProduct(product) {
    setSelectedProduct(product);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    setDragStart(null);
  }

  function closeProduct() {
    setSelectedProduct(null);
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    setDragStart(null);
  }

  function decreaseZoom() {
    setZoomLevel((value) => {
      const nextValue = Math.max(1, value - 0.2);

      if (nextValue === 1) {
        setDragPosition({ x: 0, y: 0 });
        setDragStart(null);
      }

      return nextValue;
    });
  }

  function increaseZoom() {
    setZoomLevel((value) => Math.min(2.4, value + 0.2));
  }

  function handlePointerDown(event) {
    if (zoomLevel <= 1) {
      return;
    }

    setDragStart({
      x: event.clientX - dragPosition.x,
      y: event.clientY - dragPosition.y,
    });
  }

  function handlePointerMove(event) {
    if (!dragStart || zoomLevel <= 1) {
      return;
    }

    setDragPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  }

  function stopDragging() {
    setDragStart(null);
  }

  return (
    <Layout>
      <main className="camisetas-page page-bg">
        <section className="camisetas-section page-section">
          <div className="camisetas-container page-container">
            <aside className="camisetas-sidebar">
              <nav className="camisetas-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/camisetas">Camiseta</Link>
              </nav>

              <div className="filter-group">
                <h2>Categorias</h2>

                <button className="filter-button is-active" type="button">
                  Todas
                </button>

                <button className="filter-button" type="button">
                  Básicas
                </button>

                <button className="filter-button" type="button">
                  Estampadas
                </button>

                <button className="filter-button" type="button">
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
                    onClick={() => openProduct(product)}
                  />
                ))}
              </div>

              {selectedProduct && (
                <div
                  className="product-zoom-overlay"
                  role="presentation"
                  onClick={closeProduct}
                >
                  <div
                    className="product-zoom-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedProduct.title}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="zoom-controls">
                      <button
                        className="zoom-close"
                        type="button"
                        onClick={closeProduct}
                        aria-label="Fechar zoom"
                      >
                        ×
                      </button>

                      <div className="zoom-actions">
                        <button
                          type="button"
                          onClick={decreaseZoom}
                          aria-label="Diminuir zoom"
                        >
                          −
                        </button>

                        <button
                          type="button"
                          onClick={increaseZoom}
                          aria-label="Aumentar zoom"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      className={`zoom-image-wrapper ${
                        zoomLevel > 1 ? "is-draggable" : ""
                      }`}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={stopDragging}
                      onPointerCancel={stopDragging}
                      onPointerLeave={stopDragging}
                    >
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        draggable="false"
                        style={{
                          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${zoomLevel})`,
                        }}
                      />
                    </div>

                    <div className="product-zoom-info">
                      <h3>{selectedProduct.title}</h3>
                      <span>{selectedProduct.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Camisetas;