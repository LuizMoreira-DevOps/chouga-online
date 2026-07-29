import { supabase } from "../lib/supabaseClient";

export async function getAvaliacoesProduto(produtoId) {
  const { data, error } = await supabase
    .from("avaliacoes_produto")
    .select(
      `
        id,
        nome,
        titulo,
        comentario,
        nota,
        cor,
        tamanho,
        compra_verificada,
        created_at
      `,
    )
    .eq("produto_id", produtoId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getResumoAvaliacoesProduto(produtoId) {
  const { data, error } = await supabase
    .from("avaliacoes_produto_resumo")
    .select(
      `
        produto_id,
        quantidade_avaliacoes,
        nota_media,
        quantidade_nota_5,
        quantidade_nota_4,
        quantidade_nota_3,
        quantidade_nota_2,
        quantidade_nota_1
      `,
    )
    .eq("produto_id", produtoId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (
    data ?? {
      produto_id: produtoId,
      quantidade_avaliacoes: 0,
      nota_media: 0,
      quantidade_nota_5: 0,
      quantidade_nota_4: 0,
      quantidade_nota_3: 0,
      quantidade_nota_2: 0,
      quantidade_nota_1: 0,
    }
  );
}

export async function createAvaliacaoProduto({
  produtoId,
  nome,
  titulo,
  comentario,
  nota,
  cor = null,
  tamanho = null,
}) {
  const payload = {
    produto_id: produtoId,
    nome: nome.trim(),
    titulo: titulo.trim(),
    comentario: comentario.trim(),
    nota: Number(nota),
    cor: cor?.trim() || null,
    tamanho: tamanho?.trim() || null,
  };

  const { error } = await supabase.from("avaliacoes_produto").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
