import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DEFAULT_MARCA_NOME = process.env.DEFAULT_MARCA_NOME || "Chouga";
const DEFAULT_MARCA_SLUG = process.env.DEFAULT_MARCA_SLUG || "chouga";

const SYNC_WRITE = process.env.SYNC_WRITE === "true";

const COLOR_HEX_MAP = {
  preto: "#000000",
  branca: "#ffffff",
  branco: "#ffffff",
  vermelho: "#ff0000",
  vermelha: "#ff0000",
  azul: "#0000ff",
  bege: "#d8c3a5",
  cinza: "#808080",
};

const SIZE_ORDER_MAP = {
  pp: 1,
  p: 2,
  m: 3,
  g: 4,
  gg: 5,
  xg: 6,
  xgg: 7,
};

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no .env",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAttributes(item) {
  if (!item || typeof item !== "object") {
    return {};
  }

  if (item.attributes && typeof item.attributes === "object") {
    return item.attributes;
  }

  return item;
}

function getSingleRelation(relation) {
  if (!relation || typeof relation !== "object") {
    return null;
  }

  if (relation.data) {
    return getAttributes(relation.data);
  }

  return getAttributes(relation);
}

function getManyRelation(relation) {
  if (!relation || typeof relation !== "object") {
    return [];
  }

  if (Array.isArray(relation.data)) {
    return relation.data.map(getAttributes);
  }

  if (Array.isArray(relation)) {
    return relation.map(getAttributes);
  }

  return [];
}

function getNames(relation) {
  return getManyRelation(relation)
    .map((item) => item.nome ?? item.name)
    .filter(Boolean);
}

function getImageUrl(image) {
  const imageUrl = image?.url;

  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${STRAPI_URL}${imageUrl}`;
}

function getMainImageUrl(produto) {
  const imagens = produto.imagens ?? produto.imagem;

  if (!imagens || typeof imagens !== "object") {
    return null;
  }

  if (Array.isArray(imagens.data)) {
    const firstImage = getAttributes(imagens.data[0]);

    return getImageUrl(firstImage);
  }

  if (imagens.data) {
    const image = getAttributes(imagens.data);

    return getImageUrl(image);
  }

  if (Array.isArray(imagens)) {
    return getImageUrl(getAttributes(imagens[0]));
  }

  return getImageUrl(getAttributes(imagens));
}

function normalizeProduto(strapiProduto) {
  const produto = getAttributes(strapiProduto);
  const categoria = getSingleRelation(produto.categoria);

  return {
    slug: produto.slug,
    nome: produto.nome ?? produto.titulo ?? produto.title,
    descricao: produto.descricao ?? produto.description ?? null,
    preco: produto.preco,
    preco_promocional: produto.preco_promocional ?? null,
    categoria: categoria?.nome ?? categoria?.name ?? null,
    cores: getNames(produto.cores),
    tamanhos: getNames(produto.tamanhos),
    imagem_url: getMainImageUrl(produto),
    ativo: produto.ativo ?? true,
    destaque: produto.destaque ?? false,
  };
}

function getColorHex(nome) {
  const slug = slugify(nome);

  return COLOR_HEX_MAP[slug] || "#000000";
}

function getSizeOrder(nome) {
  const slug = slugify(nome);

  return SIZE_ORDER_MAP[slug] || 99;
}

function buildSku(produto, cor, tamanho) {
  return [produto.slug, slugify(cor), slugify(tamanho)]
    .filter(Boolean)
    .join("-");
}

async function fetchProdutosFromStrapi() {
  const response = await fetch(`${STRAPI_URL}/api/produtos?populate=*`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos no Strapi: ${response.status}`);
  }

  const json = await response.json();

  return json.data ?? [];
}

async function upsertAndReturnSingle(table, payload, onConflict) {
  if (!SYNC_WRITE) {
    console.log(`[DRY RUN] upsert em ${table}:`, payload);

    return {
      id: `dry-run-${table}-${payload.slug || payload.sku || "item"}`,
      ...payload,
    };
  }

  const { data, error } = await supabase
    .from(table)
    .upsert(payload, { onConflict })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro em ${table}: ${error.message}`);
  }

  return data;
}

async function deleteProductImages(produtoId) {
  if (!SYNC_WRITE) {
    console.log(`[DRY RUN] remover imagens antigas do produto ${produtoId}`);
    return;
  }

  const { error } = await supabase
    .from("imagens_produto")
    .delete()
    .eq("produto_id", produtoId);

  if (error) {
    throw new Error(`Erro ao remover imagens_produto: ${error.message}`);
  }
}

async function insertProductImage(produtoId, produto) {
  if (!produto.imagem_url) {
    console.log("Produto sem imagem principal. Pulando imagem.");
    return;
  }

  const payload = {
    produto_id: produtoId,
    url: produto.imagem_url,
    alt_text: produto.nome,
    ordem: 1,
    principal: true,
  };

  if (!SYNC_WRITE) {
    console.log("[DRY RUN] insert em imagens_produto:", payload);
    return;
  }

  const { error } = await supabase.from("imagens_produto").insert(payload);

  if (error) {
    throw new Error(`Erro ao inserir imagens_produto: ${error.message}`);
  }
}

async function syncProduto(produto) {
  console.log(`\nSincronizando produto: ${produto.nome}`);

  const categoriaSlug = slugify(produto.categoria);
  const categoria = await upsertAndReturnSingle(
    "categorias",
    {
      nome: produto.categoria,
      slug: categoriaSlug,
      ativo: true,
      atualizado_em: new Date().toISOString(),
    },
    "slug",
  );

  const marca = await upsertAndReturnSingle(
    "marcas",
    {
      nome: DEFAULT_MARCA_NOME,
      slug: DEFAULT_MARCA_SLUG,
      ativo: true,
      atualizado_em: new Date().toISOString(),
    },
    "slug",
  );

  const produtoDb = await upsertAndReturnSingle(
    "produtos",
    {
      nome: produto.nome,
      categoria_id: categoria.id,
      marca_id: marca.id,
      slug: produto.slug,
      descricao: produto.descricao,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      destaque: produto.destaque,
      ativo: produto.ativo,
      atualizado_em: new Date().toISOString(),
    },
    "slug",
  );

  await deleteProductImages(produtoDb.id);
  await insertProductImage(produtoDb.id, produto);

  for (const corNome of produto.cores) {
    const corSlug = slugify(corNome);

    const cor = await upsertAndReturnSingle(
      "cores",
      {
        nome: corNome,
        slug: corSlug,
        hexadecimal: getColorHex(corNome),
        ativo: true,
        atualizado_em: new Date().toISOString(),
      },
      "slug",
    );

    for (const tamanhoNome of produto.tamanhos) {
      const tamanhoSlug = slugify(tamanhoNome);

      const tamanho = await upsertAndReturnSingle(
        "tamanhos",
        {
          nome: tamanhoNome,
          slug: tamanhoSlug,
          ordem: getSizeOrder(tamanhoNome),
          ativo: true,
          atualizado_em: new Date().toISOString(),
        },
        "slug",
      );

      const sku = buildSku(produto, corNome, tamanhoNome);

      await upsertAndReturnSingle(
        "variacoes_produto",
        {
          produto_id: produtoDb.id,
          cor_id: cor.id,
          tamanho_id: tamanho.id,
          sku,
          estoque: 0,
          ativo: true,
          atualizado_em: new Date().toISOString(),
        },
        "sku",
      );
    }
  }
}

async function syncProdutos() {
  console.log("Buscando produtos no Strapi...");
  console.log(`Modo de escrita: ${SYNC_WRITE ? "ATIVO" : "DRY RUN"}`);

  const strapiProdutos = await fetchProdutosFromStrapi();

  if (strapiProdutos.length === 0) {
    console.log("Nenhum produto encontrado no Strapi.");
    return;
  }

  const produtos = strapiProdutos.map(normalizeProduto);

  console.log("\nProdutos normalizados:");
  console.table(produtos);

  for (const produto of produtos) {
    if (
      !produto.slug ||
      !produto.nome ||
      !produto.preco ||
      !produto.categoria
    ) {
      console.warn("Produto incompleto. Pulando:", produto);
      continue;
    }

    await syncProduto(produto);
  }

  if (!SYNC_WRITE) {
    console.log("\nDRY RUN concluído. Nada foi gravado no Supabase.");
    console.log("Para gravar de verdade, altere SYNC_WRITE=true no .env.");
    return;
  }

  console.log("\nSincronização concluída com sucesso.");
}

syncProdutos().catch((error) => {
  console.error("\nFalha na sincronização:");
  console.error(error);
  process.exit(1);
});
