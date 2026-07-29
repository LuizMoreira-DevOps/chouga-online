-- Issue #168
-- Relaciona imagens de produtos às respectivas cores
-- e inclui os dados da cor na view pública do catálogo.

alter table public.imagens_produto
  add column if not exists cor_id uuid null;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'imagens_produto'
      and constraint_name = 'imagens_produto_cor_id_fkey'
      and constraint_type = 'FOREIGN KEY'
  ) then
    alter table public.imagens_produto
      add constraint imagens_produto_cor_id_fkey
      foreign key (cor_id)
      references public.cores(id)
      on delete set null;
  end if;
end
$$;

create index if not exists idx_imagens_produto_cor_id
  on public.imagens_produto (cor_id);

create or replace view public.produtos_catalogo
with (security_invoker = true)
as
select
  p.id,
  p.nome,
  p.slug,
  p.descricao,
  p.preco,
  p.preco_promocional,
  p.destaque,
  p.ativo,

  categoria.nome as categoria,
  marca.nome as marca,

  coalesce(
    json_agg(
      distinct jsonb_build_object(
        'id', imagem.id,
        'url', imagem.url,
        'alt_text', imagem.alt_text,
        'ordem', imagem.ordem,
        'principal', imagem.principal,
        'cor_id', imagem.cor_id,
        'cor', imagem_cor.nome,
        'cor_slug', imagem_cor.slug,
        'hexadecimal', imagem_cor.hexadecimal
      )
    ) filter (where imagem.id is not null),
    '[]'::json
  ) as imagens,

  coalesce(
    json_agg(
      distinct jsonb_build_object(
        'cor', variacao_cor.nome,
        'tamanho', tamanho.nome,
        'sku', variacao.sku,
        'estoque', variacao.estoque,
        'ativo', variacao.ativo
      )
    ) filter (where variacao.id is not null),
    '[]'::json
  ) as variacoes,

  coalesce(
    json_agg(distinct tag.nome)
      filter (where tag.id is not null),
    '[]'::json
  ) as tags,

  categoria.slug as categoria_slug,
  marca.slug as marca_slug,

  p.descricao_detalhada,
  p.inspiracao,
  p.caracteristicas,
  p.composicao,
  p.cuidados,
  p.tipo_modelagem,
  p.tamanho_modelo,
  p.altura_modelo_cm,
  p.medidas_modelo,
  p.observacoes_adicionais,
  p.tipo_guia_medidas

from public.produtos p

join public.categorias categoria
  on categoria.id = p.categoria_id

join public.marcas marca
  on marca.id = p.marca_id

left join public.imagens_produto imagem
  on imagem.produto_id = p.id

left join public.cores imagem_cor
  on imagem_cor.id = imagem.cor_id

left join public.variacoes_produto variacao
  on variacao.produto_id = p.id

left join public.cores variacao_cor
  on variacao_cor.id = variacao.cor_id

left join public.tamanhos tamanho
  on tamanho.id = variacao.tamanho_id

left join public.produto_tag produto_tag
  on produto_tag.produto_id = p.id

left join public.tags tag
  on tag.id = produto_tag.tag_id

group by
  p.id,
  categoria.nome,
  categoria.slug,
  marca.nome,
  marca.slug;