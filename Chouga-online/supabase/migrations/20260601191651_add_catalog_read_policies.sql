
  create policy "public_read_active_categorias"
  on "public"."categorias"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_active_cores"
  on "public"."cores"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_imagens_de_produtos_ativos"
  on "public"."imagens_produto"
  as permissive
  for select
  to anon
using ((EXISTS ( SELECT 1
   FROM public.produtos p
  WHERE ((p.id = imagens_produto.produto_id) AND (p.ativo = true)))));



  create policy "public_read_active_marcas"
  on "public"."marcas"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_tags_de_produtos_ativos"
  on "public"."produto_tag"
  as permissive
  for select
  to anon
using ((EXISTS ( SELECT 1
   FROM public.produtos p
  WHERE ((p.id = produto_tag.produto_id) AND (p.ativo = true)))));



  create policy "public_read_active_produtos"
  on "public"."produtos"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_active_tags"
  on "public"."tags"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_active_tamanhos"
  on "public"."tamanhos"
  as permissive
  for select
  to anon
using ((ativo = true));



  create policy "public_read_variacoes_ativas_de_produtos_ativos"
  on "public"."variacoes_produto"
  as permissive
  for select
  to anon
using (((ativo = true) AND (EXISTS ( SELECT 1
   FROM public.produtos p
  WHERE ((p.id = variacoes_produto.produto_id) AND (p.ativo = true))))));



