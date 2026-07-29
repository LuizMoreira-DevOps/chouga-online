-- Issue #168
-- Mantém o catálogo público somente para leitura
-- e permite acesso a visitantes e usuários autenticados.

alter view public.produtos_catalogo
  set (security_invoker = true);

alter policy public_read_active_categorias
  on public.categorias
  to anon, authenticated;

alter policy public_read_active_cores
  on public.cores
  to anon, authenticated;

alter policy public_read_imagens_de_produtos_ativos
  on public.imagens_produto
  to anon, authenticated;

alter policy public_read_active_marcas
  on public.marcas
  to anon, authenticated;

alter policy public_read_tags_de_produtos_ativos
  on public.produto_tag
  to anon, authenticated;

alter policy public_read_active_produtos
  on public.produtos
  to anon, authenticated;

alter policy public_read_active_tags
  on public.tags
  to anon, authenticated;

alter policy public_read_active_tamanhos
  on public.tamanhos
  to anon, authenticated;

alter policy public_read_variacoes_ativas_de_produtos_ativos
  on public.variacoes_produto
  to anon, authenticated;

revoke all privileges
on table
  public.categorias,
  public.cores,
  public.imagens_produto,
  public.marcas,
  public.produto_tag,
  public.produtos,
  public.tags,
  public.tamanhos,
  public.variacoes_produto,
  public.produtos_catalogo
from anon, authenticated;

grant select
on table
  public.categorias,
  public.cores,
  public.imagens_produto,
  public.marcas,
  public.produto_tag,
  public.produtos,
  public.tags,
  public.tamanhos,
  public.variacoes_produto,
  public.produtos_catalogo
to anon, authenticated;