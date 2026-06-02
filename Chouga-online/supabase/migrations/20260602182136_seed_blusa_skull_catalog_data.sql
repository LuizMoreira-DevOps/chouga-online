insert into categorias (
  nome,
  slug,
  ativo
)
values (
  'Blusas',
  'blusas',
  true
)
on conflict (slug) do nothing;

insert into produtos (
  nome,
  categoria_id,
  marca_id,
  slug,
  descricao,
  preco,
  preco_promocional,
  destaque,
  ativo
)
select
  'Blusa Chouga Skull',
  c.id,
  m.id,
  'blusa-chouga-skull',
  'Blusa streetwear Chouga com estampa Skull.',
  189.90,
  null,
  true,
  true
from categorias c
join marcas m on m.slug = 'chouga'
where c.slug = 'blusas'
on conflict (slug) do nothing;

insert into imagens_produto (
  produto_id,
  url,
  alt_text,
  ordem,
  principal
)
select
  p.id,
  'blusa-chouga-skull.jpeg',
  'Blusa Chouga Skull',
  1,
  true
from produtos p
where p.slug = 'blusa-chouga-skull'
  and not exists (
    select 1
    from imagens_produto ip
    where ip.produto_id = p.id
      and ip.url = 'blusa-chouga-skull.jpeg'
  );

insert into variacoes_produto (
  produto_id,
  cor_id,
  tamanho_id,
  sku,
  estoque,
  ativo
)
select
  p.id,
  co.id,
  t.id,
  'CHOUGA-BLUSA-SKULL-PRETO-M',
  5,
  true
from produtos p
join cores co on co.slug = 'preto'
join tamanhos t on t.nome = 'M'
where p.slug = 'blusa-chouga-skull'
on conflict (sku) do nothing;

insert into produto_tag (
  produto_id,
  tag_id
)
select
  p.id,
  tg.id
from produtos p
join tags tg on tg.slug = 'estampada'
where p.slug = 'blusa-chouga-skull'
  and not exists (
    select 1
    from produto_tag pt
    where pt.produto_id = p.id
      and pt.tag_id = tg.id
  );