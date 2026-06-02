create or replace view public.produtos_catalogo
with (security_invoker = true) as
select
  p.id,
  p.nome,
  p.slug,
  p.descricao,
  p.preco,
  p.preco_promocional,
  p.destaque,
  p.ativo,
  c.nome as categoria,
  m.nome as marca,

  coalesce(
    json_agg(
      distinct jsonb_build_object(
        'url', ip.url,
        'alt_text', ip.alt_text,
        'ordem', ip.ordem,
        'principal', ip.principal
      )
    ) filter (where ip.id is not null),
    '[]'
  ) as imagens,

  coalesce(
    json_agg(
      distinct jsonb_build_object(
        'cor', co.nome,
        'tamanho', t.nome,
        'sku', vp.sku,
        'estoque', vp.estoque,
        'ativo', vp.ativo
      )
    ) filter (where vp.id is not null),
    '[]'
  ) as variacoes,

  coalesce(
    json_agg(distinct tg.nome) filter (where tg.id is not null),
    '[]'
  ) as tags

from public.produtos p
join public.categorias c on c.id = p.categoria_id
join public.marcas m on m.id = p.marca_id
left join public.imagens_produto ip on ip.produto_id = p.id
left join public.variacoes_produto vp on vp.produto_id = p.id
left join public.cores co on co.id = vp.cor_id
left join public.tamanhos t on t.id = vp.tamanho_id
left join public.produto_tag pt on pt.produto_id = p.id
left join public.tags tg on tg.id = pt.tag_id
group by
  p.id,
  c.nome,
  m.nome;