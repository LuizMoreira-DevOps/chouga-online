-- Issue #168
-- Relaciona as imagens da Camiseta Chouga Skateboard
-- às respectivas cores.

update public.imagens_produto imagem
set cor_id = cor.id
from public.produtos produto
cross join public.cores cor
where imagem.produto_id = produto.id
  and produto.slug = 'camiseta-chouga-skateboard'
  and cor.slug = 'preto'
  and imagem.url like '%camiseta_skateboard_preta_7235f6fa56.jpeg';

update public.imagens_produto imagem
set cor_id = cor.id
from public.produtos produto
cross join public.cores cor
where imagem.produto_id = produto.id
  and produto.slug = 'camiseta-chouga-skateboard'
  and cor.slug = 'branco'
  and imagem.url like '%camiseta_skateboard_branca_062c493230.jpeg';