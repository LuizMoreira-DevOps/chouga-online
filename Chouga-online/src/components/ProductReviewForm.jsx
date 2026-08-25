import { useMemo, useState } from "react";

import { createAvaliacaoProduto } from "../services/avaliacoesServices";

import "../css/productReviews.css";

const INITIAL_FORM = {
  nome: "",
  titulo: "",
  comentario: "",
  nota: 0,
  cor: "",
  tamanho: "",
};

const RATING_VALUES = [1, 2, 3, 4, 5];

function ProductReviewForm({
  product,
  availableColors = [],
  availableSizes = [],
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const normalizedColors = useMemo(
    () =>
      [...new Set(availableColors.map((color) => String(color).trim()))].filter(
        Boolean,
      ),
    [availableColors],
  );

  const normalizedSizes = useMemo(
    () =>
      [...new Set(availableSizes.map((size) => String(size).trim()))].filter(
        Boolean,
      ),
    [availableSizes],
  );

  const visibleRating = hoveredRating || formData.nota;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (feedback.message) {
      setFeedback({
        type: "",
        message: "",
      });
    }
  }

  function handleRatingSelect(rating) {
    setFormData((currentData) => ({
      ...currentData,
      nota: rating,
    }));

    if (feedback.message) {
      setFeedback({
        type: "",
        message: "",
      });
    }
  }

  function validateForm() {
    if (!formData.nota) {
      return "Selecione uma nota de 1 a 5 estrelas.";
    }

    if (formData.nome.trim().length < 2) {
      return "Informe seu nome com pelo menos 2 caracteres.";
    }

    if (formData.titulo.trim().length < 3) {
      return "O título deve ter pelo menos 3 caracteres.";
    }

    if (formData.comentario.trim().length < 10) {
      return "O comentário deve ter pelo menos 10 caracteres.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setFeedback({
        type: "error",
        message: validationError,
      });

      return;
    }

    try {
      setSubmitting(true);
      setFeedback({
        type: "",
        message: "",
      });

      await createAvaliacaoProduto({
        produtoId: product.id,
        nome: formData.nome,
        titulo: formData.titulo,
        comentario: formData.comentario,
        nota: formData.nota,
        cor: formData.cor,
        tamanho: formData.tamanho,
      });

      setFormData(INITIAL_FORM);
      setHoveredRating(0);

      setFeedback({
        type: "success",
        message:
          "Avaliação enviada com sucesso. Ela será analisada antes da publicação.",
      });
    } catch (submitError) {
      console.error("Erro ao enviar avaliação:", submitError);

      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Não foi possível enviar sua avaliação. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!product?.id) {
    return null;
  }

  return (
    <section
      className="product-review-form-section"
      aria-labelledby="product-review-form-title"
    >
      <div className="product-review-form-heading">
        <span className="product-reviews-eyebrow">Conte sua experiência</span>

        <h2 id="product-review-form-title">Avalie este produto</h2>

        <p>Sua opinião ajuda outras pessoas a conhecerem melhor a peça.</p>
      </div>

      <form className="product-review-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="product-review-rating-fieldset">
          <legend>
            Sua nota
            <span aria-hidden="true">*</span>
          </legend>

          <div
            className="product-review-rating-input"
            onMouseLeave={() => setHoveredRating(0)}
          >
            {RATING_VALUES.map((rating) => (
              <button
                key={rating}
                type="button"
                className={rating <= visibleRating ? "is-selected" : ""}
                onClick={() => handleRatingSelect(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onFocus={() => setHoveredRating(rating)}
                onBlur={() => setHoveredRating(0)}
                aria-label={`${rating} ${
                  rating === 1 ? "estrela" : "estrelas"
                }`}
                aria-pressed={formData.nota === rating}
              >
                ★
              </button>
            ))}
          </div>

          <span className="product-review-rating-description">
            {formData.nota
              ? `${formData.nota} de 5 estrelas`
              : "Selecione de 1 a 5 estrelas"}
          </span>
        </fieldset>

        <div className="product-review-form-grid">
          <label>
            <span>
              Nome
              <strong aria-hidden="true">*</strong>
            </span>

            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              minLength={2}
              maxLength={80}
              autoComplete="name"
              disabled={submitting}
              required
            />
          </label>

          <label>
            <span>
              Título da avaliação
              <strong aria-hidden="true">*</strong>
            </span>

            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              minLength={3}
              maxLength={120}
              disabled={submitting}
              required
            />
          </label>

          {normalizedColors.length > 0 && (
            <label>
              <span>Cor comprada</span>

              <select
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Não informar</option>

                {normalizedColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
          )}

          {normalizedSizes.length > 0 && (
            <label>
              <span>Tamanho comprado</span>

              <select
                name="tamanho"
                value={formData.tamanho}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Não informar</option>

                {normalizedSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <label className="product-review-comment-field">
          <span>
            Comentário
            <strong aria-hidden="true">*</strong>
          </span>

          <textarea
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            minLength={10}
            maxLength={2000}
            rows={6}
            disabled={submitting}
            required
          />

          <small>{formData.comentario.length}/2000 caracteres</small>
        </label>

        <div className="product-review-form-footer">
          <p>Sua avaliação será analisada antes de aparecer publicamente.</p>

          <button
            type="submit"
            className="action product-review-submit"
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Enviar avaliação"}
          </button>
        </div>

        {feedback.message && (
          <p
            className={`product-review-form-feedback is-${feedback.type}`}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        )}
      </form>
    </section>
  );
}

export default ProductReviewForm;
