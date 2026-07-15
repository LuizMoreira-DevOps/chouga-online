import { supabase } from "../lib/supabaseClient";

export async function getProdutosCatalogo() {
  const { data, error } = await supabase
    .from("produtos_catalogo")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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

  return data ?? null;
}
