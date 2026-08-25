import { useEffect, useState } from "react";

import { getAvaliacoesProduto } from "../services/avaliacoesServices";

import { RatingStars } from "./ProductReviewsSummary";

import "../css/productReviews.css";

function formatReviewDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ProductReviewsList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      if (!productId) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const reviewsData = await getAvaliacoesProduto(productId);

        if (isMounted) {
          setReviews(reviewsData);
        }
      } catch (loadError) {
        console.error("Erro ao carregar avaliações:", loadError);

        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar os comentários.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <section
        className="product-reviews-list"
        aria-label="Comentários dos clientes"
      >
        <p className="product-reviews-feedback is-error" role="status">
          Não foi possível carregar os comentários.
        </p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="product-reviews-list"
      aria-labelledby="product-reviews-list-title"
    >
      <div className="product-reviews-list-heading">
        <span className="product-reviews-eyebrow">Comentários</span>

        <h2 id="product-reviews-list-title">Experiências compartilhadas</h2>
      </div>

      <div className="product-reviews-list-content">
        {reviews.map((review) => {
          const formattedDate = formatReviewDate(review.created_at);

          return (
            <article key={review.id} className="product-review-card">
              <header className="product-review-card-header">
                <div>
                  <strong>{review.nome}</strong>

                  {formattedDate && (
                    <time dateTime={review.created_at}>{formattedDate}</time>
                  )}
                </div>

                {review.compra_verificada && (
                  <span className="product-review-verified">
                    Compra verificada
                  </span>
                )}
              </header>

              <RatingStars
                rating={review.nota}
                label={`${review.nota} de 5 estrelas`}
              />

              <h3>{review.titulo}</h3>

              <p>{review.comentario}</p>

              {(review.cor || review.tamanho) && (
                <dl className="product-review-details">
                  {review.cor && (
                    <div>
                      <dt>Cor</dt>
                      <dd>{review.cor}</dd>
                    </div>
                  )}

                  {review.tamanho && (
                    <div>
                      <dt>Tamanho</dt>
                      <dd>{review.tamanho}</dd>
                    </div>
                  )}
                </dl>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ProductReviewsList;
