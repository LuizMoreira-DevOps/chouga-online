import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import ProductZoomModal from "../components/ProductZoomModal";

import useProductZoom from "../hooks/useProductZoom";
import { getProdutoBySlug } from "../services/produtosServices";

import SizeGuideDrawer from "../components/SizeGuideDrawer";

import { sizeGuides } from "../constants/sizeGuides";

import RelatedProducts from "../components/RelatedProducts";

import ProductReviewsSummary from "../components/ProductReviewsSummary";

import "../css/produtoDetalhes.css";

import ProductReviewsList from "../components/ProductReviewsList";

import ProductReviewForm from "../components/ProductReviewForm";

const legacyImages = import.meta.glob(
  [
    "../assets/images/camisetas/*.{avif,gif,jpeg,jpg,png,svg,webp}",
    "../assets/images/blusas/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  ],
  {
    eager: true,
    import: "default",
  },
);

const SIZE_ORDER = ["PP", "P", "M", "G", "GG", "XG", "XGG"];

const MAX_ORDER_QUANTITY = 10;

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

function formatModelHeight(heightInCentimeters) {
  const height = Number(heightInCentimeters);

  if (!Number.isFinite(height) || height <= 0) {
    return "";
  }

  if (height < 100) {
    return `${height} cm`;
  }

  return `${(height / 100).toFixed(2).replace(".", ",")} m`;
}

function buildProductUrl(slug) {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL;
  const siteUrl = configuredSiteUrl || window.location.origin;

  return `${siteUrl.replace(/\/$/, "")}/produtos/${encodeURIComponent(slug)}`;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isLongSleeveCategory(category) {
  return (
    category.includes("manga longa") ||
    category.includes("manga-longa") ||
    category.includes("blusa")
  );
}

function getAssetFolder(product) {
  const category = normalizeText(
    product?.categoria_slug || product?.categoria || product?.category,
  );

  if (isLongSleeveCategory(category)) {
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
      ordem: Number(image.ordem ?? index + 1),
      corId: image.cor_id ?? null,
      cor: String(image.cor ?? "").trim(),
      corSlug: normalizeText(image.cor_slug || image.cor),
      hexadecimal: image.hexadecimal ?? null,
    }))
    .filter((image) => image.url)
    .sort((firstImage, secondImage) => {
      const principalDifference =
        Number(secondImage.principal) - Number(firstImage.principal);

      if (principalDifference !== 0) {
        return principalDifference;
      }

      return firstImage.ordem - secondImage.ordem;
    });
}

function getAvailableVariations(product) {
  return (product?.variacoes ?? []).filter(
    (variation) => variation.ativo !== false,
  );
}

function ProdutoDetalhes({ whatsappPhone = "5541997485063" }) {
  const { slug } = useParams();

  const sizeGuideTriggerRef = useRef(null);

  const galleryRef = useRef(null);
  const purchaseFlowRef = useRef(null);

  const [showStartPurchase, setShowStartPurchase] = useState(false);
  const [hasStartedPurchase, setHasStartedPurchase] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

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
          setIsSizeGuideOpen(false);
          setQuantity(1);
          setHasStartedPurchase(false);
          setShowStartPurchase(false);
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

  useEffect(() => {
    const galleryElement = galleryRef.current;

    if (!galleryElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStartPurchase(entry.isIntersecting && !hasStartedPurchase);
      },
      {
        root: null,
        threshold: 0.15,
      },
    );

    observer.observe(galleryElement);

    return () => {
      observer.disconnect();
    };
  }, [product, hasStartedPurchase]);

  const images = useMemo(() => getProductImages(product), [product]);

  const colorImages = useMemo(() => {
    if (!selectedColor) {
      return images;
    }

    const selectedColorNormalized = normalizeText(selectedColor);

    const specificImages = images.filter(
      (image) => image.corSlug && image.corSlug === selectedColorNormalized,
    );

    if (specificImages.length > 0) {
      return specificImages;
    }

    const generalImages = images.filter((image) => !image.corId);

    if (generalImages.length > 0) {
      return generalImages;
    }

    return images;
  }, [images, selectedColor]);

  const currentImageData =
    colorImages.find((image) => image.url === selectedImage) ??
    colorImages[0] ??
    images[0] ??
    null;

  const currentImage = currentImageData?.url ?? "";

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
    ].sort((firstSize, secondSize) => {
      const firstIndex = SIZE_ORDER.indexOf(firstSize.toUpperCase());
      const secondIndex = SIZE_ORDER.indexOf(secondSize.toUpperCase());

      if (firstIndex === -1 && secondIndex === -1) {
        return firstSize.localeCompare(secondSize, "pt-BR");
      }

      if (firstIndex === -1) {
        return 1;
      }

      if (secondIndex === -1) {
        return -1;
      }

      return firstIndex - secondIndex;
    });
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

  const unitPrice = Number(selectedVariation?.preco ?? product?.preco ?? 0);

  const totalPrice = unitPrice * quantity;

  const canBuy = Boolean(selectedVariation);

  const hasModelInformation = Boolean(
    product?.tipo_modelagem ||
    product?.tamanho_modelo ||
    product?.altura_modelo_cm ||
    product?.medidas_modelo,
  );

  const hasEditorialContent = Boolean(
    product?.descricao_detalhada ||
    product?.inspiracao ||
    product?.caracteristicas?.length ||
    product?.composicao ||
    product?.cuidados ||
    hasModelInformation ||
    product?.observacoes_adicionais,
  );

  const sizeGuide = useMemo(() => {
    const category = normalizeText(
      product?.categoria_slug || product?.categoria,
    );

    if (isLongSleeveCategory(category)) {
      return sizeGuides.camiseta_manga_longa;
    }

    if (category.includes("cropped")) {
      return sizeGuides.baby_look;
    }

    if (category.includes("camiseta")) {
      return sizeGuides.camiseta_unissex;
    }

    return null;
  }, [product]);

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(MAX_ORDER_QUANTITY, currentQuantity + 1),
    );
  }

  function handleQuantityChange(event) {
    const nextQuantity = Number(event.target.value);

    if (!Number.isInteger(nextQuantity)) {
      return;
    }

    setQuantity(Math.min(Math.max(nextQuantity, 1), MAX_ORDER_QUANTITY));
  }

  function handleColorSelect(color) {
    const normalizedColor = normalizeText(color);

    const firstImageForColor = images.find(
      (image) => image.corSlug === normalizedColor,
    );

    const firstGeneralImage = images.find((image) => !image.corId);

    setSelectedColor(color);
    setSelectedImage(
      firstImageForColor?.url ?? firstGeneralImage?.url ?? images[0]?.url ?? "",
    );
    setSelectedSize("");
    setQuantity(1);
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

  function handleStartPurchase() {
    const purchaseFlow = purchaseFlowRef.current;

    if (!purchaseFlow) {
      return;
    }

    setHasStartedPurchase(true);
    setShowStartPurchase(false);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const headerOffset = 92;

    const targetPosition =
      purchaseFlow.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    purchaseFlow.focus({
      preventScroll: true,
    });
  }

  function handleWhatsApp() {
    if (!canBuy || !selectedVariation) {
      return;
    }

    const productPageUrl = buildProductUrl(product.slug);

    // Monta a mensagem para o WhatsApp
    const message = [
      "Olá! Tenho interesse neste produto da Chouga:",
      "",
      `Produto: ${product.nome}`,
      selectedColor ? `Cor: ${selectedColor}` : "",
      currentSize ? `Tamanho: ${currentSize}` : "",
      `Preço unitário: ${formatPrice(unitPrice)}`,
      `Quantidade: ${quantity}`,
      `Total do pedido: ${formatPrice(totalPrice)}`,
      "Tipo de pedido: Produção sob encomenda",
      "",
      `Link: ${productPageUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Monta a URL do WhatsApp com a mensagem codificada
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
            <div className="produto-detalhes-gallery-wrapper">
              <section ref={galleryRef} className="produto-detalhes-gallery">
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

              <section
                ref={purchaseFlowRef}
                id="produto-fluxo-compra"
                className="produto-detalhes-info"
                tabIndex={-1}
              >
                <div className="produto-detalhes-heading">
                  <p className="produto-detalhes-category">
                    {product.categoria}
                  </p>

                  <h1>{product.nome}</h1>

                  <ProductReviewsSummary productId={product.id} compact />

                  <p className="produto-detalhes-price">
                    <strong>{formatPrice(unitPrice)}</strong>
                    <span>por unidade</span>
                  </p>
                </div>

                {product.descricao && (
                  <p className="produto-detalhes-description">
                    {product.descricao}
                  </p>
                )}

                <section
                  id="produto-configuracao-pedido"
                  className="produto-detalhes-purchase"
                  aria-label="Configuração do pedido"
                  tabIndex={-1}
                >
                  {colors.length > 0 && (
                    <fieldset className="produto-detalhes-options">
                      <legend>Cor</legend>

                      <div className="produto-detalhes-option-list">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={
                              selectedColor === color ? "is-selected" : ""
                            }
                            onClick={() => handleColorSelect(color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {sizes.length > 0 && (
                    <fieldset className="produto-detalhes-options">
                      <div className="produto-detalhes-options-heading">
                        <legend>Tamanho</legend>

                        {sizeGuide && (
                          <button
                            ref={sizeGuideTriggerRef}
                            type="button"
                            className="produto-detalhes-size-guide-button"
                            onClick={() => setIsSizeGuideOpen(true)}
                            aria-haspopup="dialog"
                            aria-expanded={isSizeGuideOpen}
                            aria-controls="size-guide-drawer"
                          >
                            Guia de medidas
                          </button>
                        )}
                      </div>

                      <div className="produto-detalhes-size-list">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={
                              currentSize === size ? "is-selected" : ""
                            }
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
                    <>
                      <div className="produto-detalhes-quantity">
                        <div className="produto-detalhes-quantity-heading">
                          <span>Quantidade</span>
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
                            max={MAX_ORDER_QUANTITY}
                            value={quantity}
                            onChange={handleQuantityChange}
                            aria-label="Quantidade do produto"
                          />

                          <button
                            type="button"
                            onClick={increaseQuantity}
                            disabled={quantity >= MAX_ORDER_QUANTITY}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <p
                          className="produto-detalhes-total"
                          aria-live="polite"
                        >
                          Total para {quantity}{" "}
                          {quantity === 1 ? "unidade" : "unidades"}:
                          <strong>{formatPrice(totalPrice)}</strong>
                        </p>
                      </div>
                    </>
                  )}
                  <button
                    type="button"
                    className="produto-detalhes-buy-button"
                    disabled={!canBuy}
                    onClick={handleWhatsApp}
                  >
                    {canBuy
                      ? "Comprar pelo WhatsApp"
                      : "Selecione cor e tamanho"}
                  </button>

                  <div className="produto-detalhes-order-note">
                    <strong>Sob encomenda</strong>
                    <span>
                      O prazo de produção será confirmado pelo WhatsApp.
                    </span>
                  </div>
                </section>
              </section>
            </div>
            {hasEditorialContent && (
              <section
                className="produto-detalhes-editorial"
                aria-label="Informações sobre o produto"
              >
                <div className="produto-detalhes-editorial-heading">
                  <span>Conheça a peça</span>
                  <h2>Detalhes do produto</h2>
                </div>

                <div className="produto-detalhes-sections">
                  {product.descricao_detalhada && (
                    <details>
                      <summary>Sobre a peça</summary>

                      <div className="produto-detalhes-section-content">
                        <p>{product.descricao_detalhada}</p>
                      </div>
                    </details>
                  )}

                  {product.inspiracao && (
                    <details>
                      <summary>Inspiração</summary>

                      <div className="produto-detalhes-section-content">
                        <p>{product.inspiracao}</p>
                      </div>
                    </details>
                  )}

                  {product.caracteristicas.length > 0 && (
                    <details>
                      <summary>Características</summary>

                      <div className="produto-detalhes-section-content">
                        <ul className="produto-detalhes-feature-list">
                          {product.caracteristicas.map(
                            (caracteristica, index) => (
                              <li key={`${caracteristica}-${index}`}>
                                {caracteristica}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </details>
                  )}

                  {product.composicao && (
                    <details>
                      <summary>Composição</summary>

                      <div className="produto-detalhes-section-content">
                        <p>{product.composicao}</p>
                      </div>
                    </details>
                  )}

                  {product.cuidados && (
                    <details>
                      <summary>Cuidados com a peça</summary>

                      <div className="produto-detalhes-section-content">
                        <p>{product.cuidados}</p>
                      </div>
                    </details>
                  )}

                  {hasModelInformation && (
                    <details>
                      <summary>Modelagem</summary>

                      <div className="produto-detalhes-section-content">
                        {product.tipo_modelagem && (
                          <p>{product.tipo_modelagem}</p>
                        )}

                        {(product.tamanho_modelo ||
                          product.altura_modelo_cm ||
                          product.medidas_modelo) && (
                          <dl className="produto-detalhes-model-data">
                            {product.tamanho_modelo && (
                              <div>
                                <dt>Tamanho utilizado</dt>
                                <dd>{product.tamanho_modelo}</dd>
                              </div>
                            )}

                            {product.altura_modelo_cm && (
                              <div>
                                <dt>Altura do modelo</dt>
                                <dd>
                                  {formatModelHeight(product.altura_modelo_cm)}
                                </dd>
                              </div>
                            )}

                            {product.medidas_modelo && (
                              <div>
                                <dt>Outras medidas</dt>
                                <dd>{product.medidas_modelo}</dd>
                              </div>
                            )}
                          </dl>
                        )}
                      </div>
                    </details>
                  )}

                  {product.observacoes_adicionais && (
                    <details>
                      <summary>Informações adicionais</summary>

                      <div className="produto-detalhes-section-content">
                        <p>{product.observacoes_adicionais}</p>
                      </div>
                    </details>
                  )}
                </div>
              </section>
            )}
          </div>
        </section>

        <ProductReviewsSummary productId={product.id} />

        <ProductReviewsList productId={product.id} />

        <ProductReviewForm
          product={product}
          availableColors={colors}
          availableSizes={sizes}
        />

        {product && <RelatedProducts currentProduct={product} />}

        <SizeGuideDrawer
          isOpen={isSizeGuideOpen}
          guide={sizeGuide}
          triggerRef={sizeGuideTriggerRef}
          onClose={() => setIsSizeGuideOpen(false)}
        />

        {showStartPurchase && !selectedProduct && !isSizeGuideOpen && (
          <button
            type="button"
            className="produto-detalhes-floating-purchase"
            onClick={handleStartPurchase}
            aria-controls="produto-fluxo-compra"
          >
            <span>Começar a compra</span>
            <span aria-hidden="true">↓</span>
          </button>
        )}

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
