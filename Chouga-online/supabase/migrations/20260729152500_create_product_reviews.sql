-- Issue #166
-- Cria avaliações moderadas para os produtos do catálogo.

create table if not exists public.avaliacoes_produto (
  id uuid primary key default gen_random_uuid(),

  produto_id uuid not null
    references public.produtos(id)
    on delete cascade,

  nome text not null,
  titulo text not null,
  comentario text not null,

  nota smallint not null,

  cor text null,
  tamanho text null,

  compra_verificada boolean not null default false,
  aprovado boolean not null default false,

  created_at timestamptz not null default now(),

  constraint avaliacoes_produto_nota_check
    check (nota between 1 and 5),

  constraint avaliacoes_produto_nome_check
    check (char_length(trim(nome)) between 2 and 80),

  constraint avaliacoes_produto_titulo_check
    check (char_length(trim(titulo)) between 3 and 120),

  constraint avaliacoes_produto_comentario_check
    check (char_length(trim(comentario)) between 10 and 2000),

  constraint avaliacoes_produto_cor_check
    check (
      cor is null
      or char_length(trim(cor)) between 1 and 60
    ),

  constraint avaliacoes_produto_tamanho_check
    check (
      tamanho is null
      or char_length(trim(tamanho)) between 1 and 30
    )
);

create index if not exists idx_avaliacoes_produto_produto_id
  on public.avaliacoes_produto (produto_id);

create index if not exists idx_avaliacoes_produto_aprovado_created_at
  on public.avaliacoes_produto (
    aprovado,
    created_at desc
  );

create index if not exists idx_avaliacoes_produto_publicas
  on public.avaliacoes_produto (
    produto_id,
    created_at desc
  )
  where aprovado = true;

alter table public.avaliacoes_produto
  enable row level security;

drop policy if exists public_read_approved_product_reviews
  on public.avaliacoes_produto;

create policy public_read_approved_product_reviews
  on public.avaliacoes_produto
  for select
  to anon, authenticated
  using (aprovado = true);

drop policy if exists public_submit_product_reviews
  on public.avaliacoes_produto;

create policy public_submit_product_reviews
  on public.avaliacoes_produto
  for insert
  to anon, authenticated
  with check (
    aprovado = false
    and compra_verificada = false
    and nota between 1 and 5
    and char_length(trim(nome)) between 2 and 80
    and char_length(trim(titulo)) between 3 and 120
    and char_length(trim(comentario)) between 10 and 2000
    and exists (
      select 1
      from public.produtos produto
      where produto.id = produto_id
        and produto.ativo = true
    )
  );

revoke all privileges
  on table public.avaliacoes_produto
  from anon, authenticated;

grant select
  on table public.avaliacoes_produto
  to anon, authenticated;

grant insert (
  produto_id,
  nome,
  titulo,
  comentario,
  nota,
  cor,
  tamanho
)
  on table public.avaliacoes_produto
  to anon, authenticated;

create or replace view public.avaliacoes_produto_resumo
with (security_invoker = true)
as
select
  produto_id,

  count(*)::integer as quantidade_avaliacoes,

  round(avg(nota)::numeric, 2) as nota_media,

  count(*) filter (where nota = 5)::integer as quantidade_nota_5,
  count(*) filter (where nota = 4)::integer as quantidade_nota_4,
  count(*) filter (where nota = 3)::integer as quantidade_nota_3,
  count(*) filter (where nota = 2)::integer as quantidade_nota_2,
  count(*) filter (where nota = 1)::integer as quantidade_nota_1

from public.avaliacoes_produto
where aprovado = true
group by produto_id;

revoke all privileges
  on table public.avaliacoes_produto_resumo
  from anon, authenticated;

grant select
  on table public.avaliacoes_produto_resumo
  to anon, authenticated;