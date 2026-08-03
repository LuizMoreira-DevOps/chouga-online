import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

function getSupabaseBuildClient(projectDirectory) {
  const mode = process.env.NODE_ENV === "development"
    ? "development"
    : "production";

  const env = loadEnv(mode, projectDirectory, "VITE_");

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    env.VITE_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY sao obrigatorias para o SSG.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export async function fetchActiveProducts(projectDirectory) {
  const supabase = getSupabaseBuildClient(projectDirectory);

  const { data, error } = await supabase
    .from("produtos_catalogo")
    .select("id, nome, slug")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error(
      `Falha ao consultar produtos ativos: ${error.message}`,
    );
  }

  return data ?? [];
}
