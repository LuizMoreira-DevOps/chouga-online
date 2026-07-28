import { supabase } from "../lib/supabaseClient";

function normalizeString(value) {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || null;
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeString(item)).filter(Boolean);
}

function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  return {
    ...product,

    descricao: normalizeString(product.descricao),
    descricao_detalhada: normalizeString(product.descricao_detalhada),
    inspiracao: normalizeString(product.inspiracao),

    caracteristicas: normalizeStringList(product.caracteristicas),

    composicao: normalizeString(product.composicao),
    cuidados: normalizeString(product.cuidados),
    tipo_modelagem: normalizeString(product.tipo_modelagem),
    tamanho_modelo: normalizeString(product.tamanho_modelo),

    altura_modelo_cm:
      Number.isFinite(Number(product.altura_modelo_cm)) &&
      Number(product.altura_modelo_cm) > 0
        ? Number(product.altura_modelo_cm)
        : null,

    medidas_modelo: normalizeString(product.medidas_modelo),

    observacoes_adicionais: normalizeString(product.observacoes_adicionais),

    imagens: Array.isArray(product.imagens) ? product.imagens : [],
    variacoes: Array.isArray(product.variacoes) ? product.variacoes : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
  };
}

export async function getProdutosCatalogo() {
  const { data, error } = await supabase
    .from("produtos_catalogo")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeProduct);
}

export async function getProdutoBySlug(slug) {
  if (!slug) {
    return null;
  }

  const { data, error } = await supabase
    .from("produtos_catalogo")
    .select("*")
    .eq("ativo", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeProduct(data);
}
