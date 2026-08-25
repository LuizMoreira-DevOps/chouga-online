import { useEffect, useState } from "react";

import { getResumoAvaliacoesProduto } from "../services/avaliacoesServices";

import "../css/productReviews.css";

const RATING_VALUES = [5, 4, 3, 2, 1];
const STAR_VALUES = [1, 2, 3, 4, 5];

function formatRating(value) {
  return Number(value || 0)
    .toFixed(1)
    .replace(".", ",");
}

function RatingStars({ rating = 0, label }) {
  const normalizedRating = Math.min(Math.max(Number(rating) || 0, 0), 5);

  const roundedRating = Math.round(normalizedRating);

  return (
    <span
      className="product-rating-stars"
      role="img"
      aria-label={label || `Nota ${normalizedRating} de 5 estrelas`}
    >
      {STAR_VALUES.map((star) => (
        <span
          key={star}
          className={star <= roundedRating ? "is-filled" : ""}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ProductReviewsSummary({ productId, compact = false }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      if (!productId) {
        setSummary(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const summaryData = await getResumoAvaliacoesProduto(productId);

        if (isMounted) {
          setSummary(summaryData);
        }
      } catch (loadError) {
        console.error("Erro ao carregar resumo das avaliações:", loadError);

        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar as avaliações.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading || error) {
    return null;
  }

  const totalReviews = Number(summary?.quantidade_avaliacoes) || 0;
  const averageRating = Number(summary?.nota_media) || 0;

  if (compact) {
    if (totalReviews === 0) {
      return (
        <div className="product-rating-compact is-empty">
          <RatingStars rating={0} label="Produto ainda sem avaliações" />

          <span>Sem avaliações</span>
        </div>
      );
    }

    return (
      <div className="product-rating-compact">
        <RatingStars rating={averageRating} />

        <strong>{formatRating(averageRating)}</strong>

        <span>
          {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
        </span>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <section
        className="product-reviews-summary product-reviews-summary-empty"
        aria-labelledby="product-reviews-title"
      >
        <div>
          <span className="product-reviews-eyebrow">Avaliações</span>

          <h2 id="product-reviews-title">Ainda não há avaliações</h2>

          <p>
            Este produto ainda não recebeu comentários publicados. Seja a
            primeira pessoa a compartilhar sua experiência.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="product-reviews-summary"
      aria-labelledby="product-reviews-title"
    >
      <div className="product-reviews-summary-heading">
        <span className="product-reviews-eyebrow">Avaliações</span>

        <h2 id="product-reviews-title">Opiniões de quem comprou</h2>
      </div>

      <div className="product-reviews-summary-content">
        <div className="product-reviews-average">
          <strong>{formatRating(averageRating)}</strong>

          <RatingStars rating={averageRating} />

          <span>
            Baseado em {totalReviews}{" "}
            {totalReviews === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>

        <div
          className="product-reviews-distribution"
          aria-label="Distribuição das avaliações"
        >
          {RATING_VALUES.map((rating) => {
            const ratingCount =
              Number(summary?.[`quantidade_nota_${rating}`]) || 0;

            const percentage =
              totalReviews > 0 ? (ratingCount / totalReviews) * 100 : 0;

            return (
              <div
                key={rating}
                className="product-reviews-distribution-row"
                aria-label={`${rating} estrelas: ${ratingCount} ${
                  ratingCount === 1 ? "avaliação" : "avaliações"
                }`}
              >
                <span aria-hidden="true">{rating} ★</span>

                <div className="product-reviews-progress" aria-hidden="true">
                  <span style={{ width: `${percentage}%` }} />
                </div>

                <span aria-hidden="true">{ratingCount}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { RatingStars };

export default ProductReviewsSummary;
