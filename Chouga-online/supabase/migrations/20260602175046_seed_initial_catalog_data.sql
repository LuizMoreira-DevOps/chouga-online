-- =========================
-- SEED: CHOUGA ONLINE
-- Dados iniciais do catálogo
-- =========================

-- Categorias
insert into public.categorias (nome, slug)
values
  ('Camisetas', 'camisetas'),
  ('Blusas', 'blusas')
on conflict (slug) do nothing;

-- Marca
insert into public.marcas (nome, slug)
values
  ('Chouga', 'chouga')
on conflict (slug) do nothing;

-- Cores
insert into public.cores (nome, slug, hexadecimal)
values
  ('Branco', 'branco', '#FFFFFF'),
  ('Vermelho', 'vermelho', '#FF0000'),
  ('Azul', 'azul', '#0000FF'),
  ('Bege', 'bege', '#D6B98C'),
  ('Preto', 'preto', '#000000')
on conflict (slug) do nothing;

-- Tamanhos
insert into public.tamanhos (nome, slug, ordem)
values
  ('P', 'p', 1),
  ('M', 'm', 2),
  ('G', 'g', 3),
  ('GG', 'gg', 4)
on conflict (slug) do nothing;

-- Tags
insert into public.tags (nome, slug)
values
  ('Streetwear', 'streetwear'),
  ('Estampada', 'estampada'),
  ('Oversized', 'oversized'),
  ('Drop novo', 'drop-novo')
on conflict (slug) do nothing;

-- Produto de teste
insert into public.produtos (
  categoria_id,
  marca_id,
  nome,
  slug,
  descricao,
  preco,
  destaque
)
select
  c.id,
  m.id,
  'Camiseta Chouga Skull',
  'camiseta-chouga-skull',
  'Camiseta streetwear Chouga com estampa Skull.',
  129.90,
  true
from public.categorias c
cross join public.marcas m
where c.slug = 'camisetas'
  and m.slug = 'chouga'
on conflict (slug) do nothing;

-- Imagem do produto
insert into public.imagens_produto (
  produto_id,
  url,
  alt_text,
  ordem,
  principal
)
select
  p.id,
  'camiseta-chouga-skull.jpeg',
  'Camiseta Chouga Skull',
  1,
  true
from public.produtos p
where p.slug = 'camiseta-chouga-skull';

-- Variação do produto: Preto / M
insert into public.variacoes_produto (
  produto_id,
  cor_id,
  tamanho_id,
  sku,
  estoque
)
select
  p.id,
  co.id,
  t.id,
  'CHOUGA-SKULL-PRETO-M',
  5
from public.produtos p
cross join public.cores co
cross join public.tamanhos t
where p.slug = 'camiseta-chouga-skull'
  and co.slug = 'preto'
  and t.slug = 'm'
on conflict (sku) do nothing;

-- Tags do produto
insert into public.produto_tag (
  produto_id,
  tag_id
)
select
  p.id,
  tg.id
from public.produtos p
join public.tags tg
  on tg.slug in ('streetwear', 'estampada')
where p.slug = 'camiseta-chouga-skull'
on conflict (produto_id, tag_id) do nothing;