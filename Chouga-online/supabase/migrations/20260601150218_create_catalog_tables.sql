
  create table "public"."categorias" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "slug" text not null,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."categorias" enable row level security;


  create table "public"."cores" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "slug" text not null,
    "hexadecimal" text not null,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."cores" enable row level security;


  create table "public"."imagens_produto" (
    "id" uuid not null default gen_random_uuid(),
    "produto_id" uuid not null,
    "url" text not null,
    "alt_text" text,
    "ordem" bigint not null default '1'::bigint,
    "principal" boolean not null default false,
    "criado_em" timestamp with time zone not null default now()
      );


alter table "public"."imagens_produto" enable row level security;


  create table "public"."marcas" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "slug" text not null,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."marcas" enable row level security;


  create table "public"."produto_tag" (
    "produto_id" uuid not null,
    "tag_id" uuid not null,
    "criado_em" timestamp with time zone not null default now()
      );


alter table "public"."produto_tag" enable row level security;


  create table "public"."produtos" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "categoria_id" uuid not null,
    "marca_id" uuid not null,
    "slug" text not null,
    "descricao" text,
    "preco" numeric not null,
    "preco_promocional" numeric,
    "destaque" boolean not null default false,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."produtos" enable row level security;


  create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "slug" text not null,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."tags" enable row level security;


  create table "public"."tamanhos" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "slug" text not null,
    "ordem" bigint not null,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."tamanhos" enable row level security;


  create table "public"."variacoes_produto" (
    "id" uuid not null default gen_random_uuid(),
    "produto_id" uuid not null,
    "cor_id" uuid not null,
    "tamanho_id" uuid not null,
    "sku" text not null,
    "estoque" bigint not null default '0'::bigint,
    "ativo" boolean not null default true,
    "criado_em" timestamp with time zone not null default now(),
    "atualizado_em" timestamp with time zone not null default now()
      );


alter table "public"."variacoes_produto" enable row level security;

CREATE UNIQUE INDEX categorias_pkey ON public.categorias USING btree (id);

CREATE UNIQUE INDEX categorias_slug_key ON public.categorias USING btree (slug);

CREATE UNIQUE INDEX cores_pkey ON public.cores USING btree (id);

CREATE UNIQUE INDEX cores_slug_key ON public.cores USING btree (slug);

CREATE UNIQUE INDEX imagens_produto_pkey ON public.imagens_produto USING btree (id);

CREATE UNIQUE INDEX marcas_pkey ON public.marcas USING btree (id);

CREATE UNIQUE INDEX marcas_slug_key ON public.marcas USING btree (slug);

CREATE UNIQUE INDEX produto_tag_pkey ON public.produto_tag USING btree (produto_id, tag_id);

CREATE UNIQUE INDEX produtos_pkey ON public.produtos USING btree (id);

CREATE UNIQUE INDEX produtos_slug_key ON public.produtos USING btree (slug);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX tags_slug_key ON public.tags USING btree (slug);

CREATE UNIQUE INDEX tamanhos_pkey ON public.tamanhos USING btree (id);

CREATE UNIQUE INDEX tamanhos_slug_key ON public.tamanhos USING btree (slug);

CREATE UNIQUE INDEX variacoes_produto_pkey ON public.variacoes_produto USING btree (id);

CREATE UNIQUE INDEX variacoes_produto_sku_key ON public.variacoes_produto USING btree (sku);

alter table "public"."categorias" add constraint "categorias_pkey" PRIMARY KEY using index "categorias_pkey";

alter table "public"."cores" add constraint "cores_pkey" PRIMARY KEY using index "cores_pkey";

alter table "public"."imagens_produto" add constraint "imagens_produto_pkey" PRIMARY KEY using index "imagens_produto_pkey";

alter table "public"."marcas" add constraint "marcas_pkey" PRIMARY KEY using index "marcas_pkey";

alter table "public"."produto_tag" add constraint "produto_tag_pkey" PRIMARY KEY using index "produto_tag_pkey";

alter table "public"."produtos" add constraint "produtos_pkey" PRIMARY KEY using index "produtos_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."tamanhos" add constraint "tamanhos_pkey" PRIMARY KEY using index "tamanhos_pkey";

alter table "public"."variacoes_produto" add constraint "variacoes_produto_pkey" PRIMARY KEY using index "variacoes_produto_pkey";

alter table "public"."categorias" add constraint "categorias_slug_key" UNIQUE using index "categorias_slug_key";

alter table "public"."cores" add constraint "cores_slug_key" UNIQUE using index "cores_slug_key";

alter table "public"."imagens_produto" add constraint "imagens_produto_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE not valid;

alter table "public"."imagens_produto" validate constraint "imagens_produto_produto_id_fkey";

alter table "public"."marcas" add constraint "marcas_slug_key" UNIQUE using index "marcas_slug_key";

alter table "public"."produto_tag" add constraint "produto_tag_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE not valid;

alter table "public"."produto_tag" validate constraint "produto_tag_produto_id_fkey";

alter table "public"."produto_tag" add constraint "produto_tag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."produto_tag" validate constraint "produto_tag_tag_id_fkey";

alter table "public"."produtos" add constraint "produtos_categoria_id_fkey" FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE RESTRICT not valid;

alter table "public"."produtos" validate constraint "produtos_categoria_id_fkey";

alter table "public"."produtos" add constraint "produtos_marca_id_fkey" FOREIGN KEY (marca_id) REFERENCES public.marcas(id) ON DELETE RESTRICT not valid;

alter table "public"."produtos" validate constraint "produtos_marca_id_fkey";

alter table "public"."produtos" add constraint "produtos_slug_key" UNIQUE using index "produtos_slug_key";

alter table "public"."tags" add constraint "tags_slug_key" UNIQUE using index "tags_slug_key";

alter table "public"."tamanhos" add constraint "tamanhos_slug_key" UNIQUE using index "tamanhos_slug_key";

alter table "public"."variacoes_produto" add constraint "variacoes_produto_cor_id_fkey" FOREIGN KEY (cor_id) REFERENCES public.cores(id) ON DELETE RESTRICT not valid;

alter table "public"."variacoes_produto" validate constraint "variacoes_produto_cor_id_fkey";

alter table "public"."variacoes_produto" add constraint "variacoes_produto_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE not valid;

alter table "public"."variacoes_produto" validate constraint "variacoes_produto_produto_id_fkey";

alter table "public"."variacoes_produto" add constraint "variacoes_produto_sku_key" UNIQUE using index "variacoes_produto_sku_key";

alter table "public"."variacoes_produto" add constraint "variacoes_produto_tamanho_id_fkey" FOREIGN KEY (tamanho_id) REFERENCES public.tamanhos(id) ON DELETE RESTRICT not valid;

alter table "public"."variacoes_produto" validate constraint "variacoes_produto_tamanho_id_fkey";

grant delete on table "public"."categorias" to "anon";

grant insert on table "public"."categorias" to "anon";

grant references on table "public"."categorias" to "anon";

grant select on table "public"."categorias" to "anon";

grant trigger on table "public"."categorias" to "anon";

grant truncate on table "public"."categorias" to "anon";

grant update on table "public"."categorias" to "anon";

grant delete on table "public"."categorias" to "authenticated";

grant insert on table "public"."categorias" to "authenticated";

grant references on table "public"."categorias" to "authenticated";

grant select on table "public"."categorias" to "authenticated";

grant trigger on table "public"."categorias" to "authenticated";

grant truncate on table "public"."categorias" to "authenticated";

grant update on table "public"."categorias" to "authenticated";

grant delete on table "public"."categorias" to "service_role";

grant insert on table "public"."categorias" to "service_role";

grant references on table "public"."categorias" to "service_role";

grant select on table "public"."categorias" to "service_role";

grant trigger on table "public"."categorias" to "service_role";

grant truncate on table "public"."categorias" to "service_role";

grant update on table "public"."categorias" to "service_role";

grant delete on table "public"."cores" to "anon";

grant insert on table "public"."cores" to "anon";

grant references on table "public"."cores" to "anon";

grant select on table "public"."cores" to "anon";

grant trigger on table "public"."cores" to "anon";

grant truncate on table "public"."cores" to "anon";

grant update on table "public"."cores" to "anon";

grant delete on table "public"."cores" to "authenticated";

grant insert on table "public"."cores" to "authenticated";

grant references on table "public"."cores" to "authenticated";

grant select on table "public"."cores" to "authenticated";

grant trigger on table "public"."cores" to "authenticated";

grant truncate on table "public"."cores" to "authenticated";

grant update on table "public"."cores" to "authenticated";

grant delete on table "public"."cores" to "service_role";

grant insert on table "public"."cores" to "service_role";

grant references on table "public"."cores" to "service_role";

grant select on table "public"."cores" to "service_role";

grant trigger on table "public"."cores" to "service_role";

grant truncate on table "public"."cores" to "service_role";

grant update on table "public"."cores" to "service_role";

grant delete on table "public"."imagens_produto" to "anon";

grant insert on table "public"."imagens_produto" to "anon";

grant references on table "public"."imagens_produto" to "anon";

grant select on table "public"."imagens_produto" to "anon";

grant trigger on table "public"."imagens_produto" to "anon";

grant truncate on table "public"."imagens_produto" to "anon";

grant update on table "public"."imagens_produto" to "anon";

grant delete on table "public"."imagens_produto" to "authenticated";

grant insert on table "public"."imagens_produto" to "authenticated";

grant references on table "public"."imagens_produto" to "authenticated";

grant select on table "public"."imagens_produto" to "authenticated";

grant trigger on table "public"."imagens_produto" to "authenticated";

grant truncate on table "public"."imagens_produto" to "authenticated";

grant update on table "public"."imagens_produto" to "authenticated";

grant delete on table "public"."imagens_produto" to "service_role";

grant insert on table "public"."imagens_produto" to "service_role";

grant references on table "public"."imagens_produto" to "service_role";

grant select on table "public"."imagens_produto" to "service_role";

grant trigger on table "public"."imagens_produto" to "service_role";

grant truncate on table "public"."imagens_produto" to "service_role";

grant update on table "public"."imagens_produto" to "service_role";

grant delete on table "public"."marcas" to "anon";

grant insert on table "public"."marcas" to "anon";

grant references on table "public"."marcas" to "anon";

grant select on table "public"."marcas" to "anon";

grant trigger on table "public"."marcas" to "anon";

grant truncate on table "public"."marcas" to "anon";

grant update on table "public"."marcas" to "anon";

grant delete on table "public"."marcas" to "authenticated";

grant insert on table "public"."marcas" to "authenticated";

grant references on table "public"."marcas" to "authenticated";

grant select on table "public"."marcas" to "authenticated";

grant trigger on table "public"."marcas" to "authenticated";

grant truncate on table "public"."marcas" to "authenticated";

grant update on table "public"."marcas" to "authenticated";

grant delete on table "public"."marcas" to "service_role";

grant insert on table "public"."marcas" to "service_role";

grant references on table "public"."marcas" to "service_role";

grant select on table "public"."marcas" to "service_role";

grant trigger on table "public"."marcas" to "service_role";

grant truncate on table "public"."marcas" to "service_role";

grant update on table "public"."marcas" to "service_role";

grant delete on table "public"."produto_tag" to "anon";

grant insert on table "public"."produto_tag" to "anon";

grant references on table "public"."produto_tag" to "anon";

grant select on table "public"."produto_tag" to "anon";

grant trigger on table "public"."produto_tag" to "anon";

grant truncate on table "public"."produto_tag" to "anon";

grant update on table "public"."produto_tag" to "anon";

grant delete on table "public"."produto_tag" to "authenticated";

grant insert on table "public"."produto_tag" to "authenticated";

grant references on table "public"."produto_tag" to "authenticated";

grant select on table "public"."produto_tag" to "authenticated";

grant trigger on table "public"."produto_tag" to "authenticated";

grant truncate on table "public"."produto_tag" to "authenticated";

grant update on table "public"."produto_tag" to "authenticated";

grant delete on table "public"."produto_tag" to "service_role";

grant insert on table "public"."produto_tag" to "service_role";

grant references on table "public"."produto_tag" to "service_role";

grant select on table "public"."produto_tag" to "service_role";

grant trigger on table "public"."produto_tag" to "service_role";

grant truncate on table "public"."produto_tag" to "service_role";

grant update on table "public"."produto_tag" to "service_role";

grant delete on table "public"."produtos" to "anon";

grant insert on table "public"."produtos" to "anon";

grant references on table "public"."produtos" to "anon";

grant select on table "public"."produtos" to "anon";

grant trigger on table "public"."produtos" to "anon";

grant truncate on table "public"."produtos" to "anon";

grant update on table "public"."produtos" to "anon";

grant delete on table "public"."produtos" to "authenticated";

grant insert on table "public"."produtos" to "authenticated";

grant references on table "public"."produtos" to "authenticated";

grant select on table "public"."produtos" to "authenticated";

grant trigger on table "public"."produtos" to "authenticated";

grant truncate on table "public"."produtos" to "authenticated";

grant update on table "public"."produtos" to "authenticated";

grant delete on table "public"."produtos" to "service_role";

grant insert on table "public"."produtos" to "service_role";

grant references on table "public"."produtos" to "service_role";

grant select on table "public"."produtos" to "service_role";

grant trigger on table "public"."produtos" to "service_role";

grant truncate on table "public"."produtos" to "service_role";

grant update on table "public"."produtos" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."tamanhos" to "anon";

grant insert on table "public"."tamanhos" to "anon";

grant references on table "public"."tamanhos" to "anon";

grant select on table "public"."tamanhos" to "anon";

grant trigger on table "public"."tamanhos" to "anon";

grant truncate on table "public"."tamanhos" to "anon";

grant update on table "public"."tamanhos" to "anon";

grant delete on table "public"."tamanhos" to "authenticated";

grant insert on table "public"."tamanhos" to "authenticated";

grant references on table "public"."tamanhos" to "authenticated";

grant select on table "public"."tamanhos" to "authenticated";

grant trigger on table "public"."tamanhos" to "authenticated";

grant truncate on table "public"."tamanhos" to "authenticated";

grant update on table "public"."tamanhos" to "authenticated";

grant delete on table "public"."tamanhos" to "service_role";

grant insert on table "public"."tamanhos" to "service_role";

grant references on table "public"."tamanhos" to "service_role";

grant select on table "public"."tamanhos" to "service_role";

grant trigger on table "public"."tamanhos" to "service_role";

grant truncate on table "public"."tamanhos" to "service_role";

grant update on table "public"."tamanhos" to "service_role";

grant delete on table "public"."variacoes_produto" to "anon";

grant insert on table "public"."variacoes_produto" to "anon";

grant references on table "public"."variacoes_produto" to "anon";

grant select on table "public"."variacoes_produto" to "anon";

grant trigger on table "public"."variacoes_produto" to "anon";

grant truncate on table "public"."variacoes_produto" to "anon";

grant update on table "public"."variacoes_produto" to "anon";

grant delete on table "public"."variacoes_produto" to "authenticated";

grant insert on table "public"."variacoes_produto" to "authenticated";

grant references on table "public"."variacoes_produto" to "authenticated";

grant select on table "public"."variacoes_produto" to "authenticated";

grant trigger on table "public"."variacoes_produto" to "authenticated";

grant truncate on table "public"."variacoes_produto" to "authenticated";

grant update on table "public"."variacoes_produto" to "authenticated";

grant delete on table "public"."variacoes_produto" to "service_role";

grant insert on table "public"."variacoes_produto" to "service_role";

grant references on table "public"."variacoes_produto" to "service_role";

grant select on table "public"."variacoes_produto" to "service_role";

grant trigger on table "public"."variacoes_produto" to "service_role";

grant truncate on table "public"."variacoes_produto" to "service_role";

grant update on table "public"."variacoes_produto" to "service_role";


