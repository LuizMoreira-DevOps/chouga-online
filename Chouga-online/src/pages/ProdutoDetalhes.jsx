import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import ProductZoomModal from "../components/ProductZoomModal";

import useProductZoom from "../hooks/useProductZoom";
import { getProdutoBySlug } from "../services/produtosServices";

import "../css/produtoDetalhes.css";

const legacyImages = import.meta.glob(
  "../assets/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  {
    eager: true,
    import: "default",
  },
);

function formatPrice(value) {
  const price = Number(value);

  if (Number.isNaN(price)) {
    return "Preço indisponível";
  }

  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function buildProductUrl(slug) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  return `${siteUrl.replace(/\/$/, "")}/produtos/${slug}`;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getAssetFolder(product) {
  const category = normalizeText(
    product?.categoria_slug || product?.categoria || product?.category,
  );

  if (category.includes("blusa")) {
    return "blusas";
  }

  return "camisetas";
}

function getLegacyImage(imageUrl, assetFolder) {
  const normalizedUrl = String(imageUrl).replace(/^\/+/, "");

  const expectedSuffix = `/assets/images/${assetFolder}/${normalizedUrl}`;

  const imageEntry = Object.entries(legacyImages).find(([imagePath]) =>
    imagePath.endsWith(expectedSuffix),
  );

  return imageEntry?.[1] ?? "";
}

function getProductImage(imageUrl, assetFolder) {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    const strapiUrl =
      import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    return `${strapiUrl}${imageUrl}`;
  }

  return getLegacyImage(imageUrl, assetFolder);
}

function getProductImages(product) {
  const assetFolder = getAssetFolder(product);

  return (product?.imagens ?? [])
    .map((image, index) => ({
      id: image.id ?? `${image.url}-${index}`,
      url: getProductImage(image.url, assetFolder),
      alt: image.alt_text || product.nome || "Produto Chouga",
      principal: Boolean(image.principal),
    }))
    .filter((image) => image.url)
    .sort(
      (firstImage, secondImage) =>
        Number(secondImage.principal) - Number(firstImage.principal),
    );
}

function getAvailableVariations(product) {
  return (product?.variacoes ?? []).filter(
    (variation) =>
      variation.ativo !== false && Number(variation.estoque ?? 1) > 0,
  );
}

function ProdutoDetalhes({ whatsappPhone = "5541997485063" }) {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  const {
    selectedProduct,
    zoomLevel,
    dragPosition,
    openProduct,
    closeProduct,
    decreaseZoom,
    increaseZoom,
    handlePointerDown,
    handlePointerMove,
    stopDragging,
  } = useProductZoom();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const productData = await getProdutoBySlug(slug);

        if (isMounted) {
          setProduct(productData);
          setSelectedImage("");
          setSelectedColor("");
          setSelectedSize("");
          setQuantity(1);
        }
      } catch (loadError) {
        console.error("Erro ao carregar produto:", loadError);

        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Não foi possível carregar o produto.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const images = useMemo(() => getProductImages(product), [product]);

  const currentImage = selectedImage || images[0]?.url || "";

  const availableVariations = useMemo(
    () => getAvailableVariations(product),
    [product],
  );

  const colors = useMemo(
    () => [
      ...new Set(
        availableVariations
          .map((variation) => String(variation.cor ?? "").trim())
          .filter(Boolean),
      ),
    ],
    [availableVariations],
  );

  const sizes = useMemo(() => {
    const filteredVariations = selectedColor
      ? availableVariations.filter(
          (variation) =>
            normalizeText(variation.cor) === normalizeText(selectedColor),
        )
      : availableVariations;

    return [
      ...new Set(
        filteredVariations
          .map((variation) => String(variation.tamanho ?? "").trim())
          .filter(Boolean),
      ),
    ];
  }, [availableVariations, selectedColor]);

  const currentSize = sizes.includes(selectedSize) ? selectedSize : "";

  const selectedVariation = useMemo(() => {
    if (!availableVariations.length) {
      return null;
    }

    const requiresColor = colors.length > 0;
    const requiresSize = sizes.length > 0;

    if (requiresColor && !selectedColor) {
      return null;
    }

    if (requiresSize && !currentSize) {
      return null;
    }

    return (
      availableVariations.find((variation) => {
        const variationColor = String(variation.cor ?? "").trim();
        const variationSize = String(variation.tamanho ?? "").trim();

        const colorMatches =
          !requiresColor ||
          normalizeText(variationColor) === normalizeText(selectedColor);

        const sizeMatches = !requiresSize || variationSize === currentSize;

        return colorMatches && sizeMatches;
      }) ?? null
    );
  }, [
    availableVariations,
    colors.length,
    sizes.length,
    selectedColor,
    currentSize,
  ]);

  const availableStock = selectedVariation
    ? Math.max(0, Number(selectedVariation.estoque ?? 0))
    : 0;

  const unitPrice = Number(selectedVariation?.preco ?? product?.preco ?? 0);

  const totalPrice = unitPrice * quantity;

  const canBuy = Boolean(selectedVariation && availableStock > 0);

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(availableStock, currentQuantity + 1),
    );
  }

  function handleQuantityChange(event) {
    const nextQuantity = Number(event.target.value);

    if (!Number.isInteger(nextQuantity)) {
      return;
    }

    setQuantity(Math.min(Math.max(nextQuantity, 1), availableStock));
  }

  function handleOpenZoom() {
    if (!currentImage) {
      return;
    }

    openProduct({
      ...product,
      image: currentImage,
      imageAlt: product.nome,
      title: product.nome,
    });
  }

  function handleWhatsApp() {
    if (!canBuy || !selectedVariation) {
      return;
    }

    const productPageUrl = buildProductUrl(product.slug);

    const message = [
      "Olá! Tenho interesse neste produto da Chouga:",
      "",
      `Produto: ${product.nome}`,
      selectedColor ? `Cor: ${selectedColor}` : "",
      currentSize ? `Tamanho: ${currentSize}` : "",
      `Quantidade: ${quantity}`,
      `Preço unitário: ${formatPrice(unitPrice)}`,
      `Total: ${formatPrice(totalPrice)}`,
      selectedVariation.sku ? `SKU: ${selectedVariation.sku}` : "",
      "",
      `Link: ${productPageUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl =
      `https://wa.me/${whatsappPhone}` + `?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <Layout>
        <main className="produto-detalhes-page">
          <section className="produto-detalhes-status">
            <p>Carregando produto...</p>
          </section>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="produto-detalhes-page">
          <section className="produto-detalhes-status">
            <p>Erro ao carregar produto: {error}</p>

            <Link to="/produtos">Voltar para produtos</Link>
          </section>
        </main>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <main className="produto-detalhes-page">
          <section className="produto-detalhes-status">
            <h1>Produto não encontrado</h1>

            <Link to="/produtos">Voltar para produtos</Link>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main
        className={`produto-detalhes-page ${
          selectedProduct ? "is-zoom-open" : ""
        }`}
      >
        <section className="produto-detalhes-container">
          <nav
            className="produto-detalhes-breadcrumb"
            aria-label="Navegação estrutural"
          >
            <Link to="/">Home</Link>

            <span aria-hidden="true">/</span>

            <Link to="/produtos">Produtos</Link>

            <span aria-hidden="true">/</span>

            <span>{product.nome}</span>
          </nav>

          <div className="produto-detalhes-content">
            <section className="produto-detalhes-gallery">
              <div className="produto-detalhes-thumbnails">
                {images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    className={currentImage === image.url ? "is-active" : ""}
                    onClick={() => setSelectedImage(image.url)}
                    aria-label={`Visualizar ${image.alt}`}
                  >
                    <img src={image.url} alt={image.alt} />
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="produto-detalhes-main-image"
                onClick={handleOpenZoom}
                disabled={!currentImage}
                aria-label="Ampliar imagem do produto"
              >
                {currentImage ? (
                  <img src={currentImage} alt={product.nome} />
                ) : (
                  <span>Imagem indisponível</span>
                )}
              </button>
            </section>

            <section className="produto-detalhes-info">
              <div className="produto-detalhes-heading">
                <p className="produto-detalhes-category">{product.categoria}</p>

                <h1>{product.nome}</h1>

                <p className="produto-detalhes-price">
                  {formatPrice(product.preco)}
                </p>
              </div>

              {product.descricao && (
                <p className="produto-detalhes-description">
                  {product.descricao}
                </p>
              )}

              {colors.length > 0 && (
                <fieldset className="produto-detalhes-options">
                  <legend>
                    Cor
                    {selectedColor && <span>: {selectedColor}</span>}
                  </legend>

                  <div className="produto-detalhes-option-list">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={selectedColor === color ? "is-selected" : ""}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedSize("");
                          setQuantity(1);
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {sizes.length > 0 && (
                <fieldset className="produto-detalhes-options">
                  <legend>
                    Tamanho
                    {currentSize && <span>: {currentSize}</span>}
                  </legend>

                  <div className="produto-detalhes-size-list">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={currentSize === size ? "is-selected" : ""}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {selectedVariation && (
                <div className="produto-detalhes-quantity">
                  <div className="produto-detalhes-quantity-heading">
                    <span>Quantidade</span>

                    <span className="produto-detalhes-stock">
                      {availableStock === 1
                        ? "Última unidade"
                        : `${availableStock} unidades disponíveis`}
                    </span>
                  </div>

                  <div className="produto-detalhes-quantity-control">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={availableStock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      aria-label="Quantidade do produto"
                    />

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= availableStock}
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  <p className="produto-detalhes-total">
                    Total: <strong>{formatPrice(totalPrice)}</strong>
                  </p>
                </div>
              )}

              <button
                type="button"
                className="produto-detalhes-buy-button"
                disabled={!canBuy}
                onClick={handleWhatsApp}
              >
                {canBuy ? "Comprar pelo WhatsApp" : "Selecione as opções"}
              </button>

              <div className="produto-detalhes-sections">
                {product.inspiracao && (
                  <details>
                    <summary>Inspiração</summary>

                    <p>{product.inspiracao}</p>
                  </details>
                )}

                {product.composicao && (
                  <details>
                    <summary>Composição</summary>

                    <p>{product.composicao}</p>
                  </details>
                )}

                {product.modelagem && (
                  <details>
                    <summary>Modelagem</summary>

                    <p>{product.modelagem}</p>
                  </details>
                )}

                {product.medidas && (
                  <details>
                    <summary>Medidas</summary>

                    <p>{product.medidas}</p>
                  </details>
                )}

                {product.cuidados && (
                  <details>
                    <summary>Cuidados</summary>

                    <p>{product.cuidados}</p>
                  </details>
                )}
              </div>
            </section>
          </div>
        </section>

        <ProductZoomModal
          product={selectedProduct}
          zoomLevel={zoomLevel}
          dragPosition={dragPosition}
          onClose={closeProduct}
          onDecreaseZoom={decreaseZoom}
          onIncreaseZoom={increaseZoom}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onPointerLeave={stopDragging}
        />
      </main>
    </Layout>
  );
}

export default ProdutoDetalhes;
