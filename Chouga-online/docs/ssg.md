# SSG personalizado da Chouga Online

## Objetivo

A Chouga Online utiliza um processo personalizado de geração estática para criar arquivos HTML físicos para as rotas públicas da aplicação.

O objetivo é permitir que o GitHub Pages encontre diretamente o documento correspondente a cada rota conhecida, sem depender de um redirecionamento inicial para a página principal.

Exemplo:

```text
/produtos
```

é publicado como:

```text
dist/produtos/index.html
```

As páginas continuam utilizando React, Vite, React Router e os mesmos arquivos JavaScript e CSS compilados pelo Vite. Após o carregamento inicial, a navegação interna continua funcionando como uma SPA.

## Motivação arquitetural

Antes da adoção do SSG, o GitHub Pages não encontrava arquivos físicos para rotas internas, como:

```text
/produtos
/sobre
/produtos/:slug
```

Um arquivo `404.html` armazenava a rota original no `sessionStorage`, redirecionava o navegador para `/` e o `main.jsx` restaurava visualmente o endereço solicitado.

Embora esse fluxo permitisse abrir e atualizar rotas internas, ferramentas de auditoria identificavam a página principal como o documento efetivamente carregado.

Isso prejudicava:

- auditorias individuais com Lighthouse;
- análise de desempenho por página;
- validação de SEO;
- URLs canônicas;
- metadados de compartilhamento;
- análise confiável de rotas pelo Google Analytics e Microsoft Clarity.

O SSG foi adotado para gerar documentos físicos correspondentes às rotas públicas, mantendo o GitHub Pages como hospedagem.

## Arquitetura

A aplicação continua utilizando:

- React;
- Vite;
- React Router;
- `BrowserRouter`;
- Supabase;
- GitHub Actions;
- GitHub Pages;
- domínio próprio;
- URLs sem hash.

O SSG não substitui o React e não implementa renderização no servidor em tempo real.

Ele utiliza o HTML compilado pelo Vite como modelo e gera cópias personalizadas dentro da pasta `dist`.

## Fluxo do build

O comando principal permanece:

```bash
npm run build
```

O processo executa sequencialmente:

```text
build:client
    ↓
build:ssg
    ↓
build:validate
```

### Build do cliente

O Vite compila a aplicação e cria a estrutura inicial da pasta:

```text
dist/
```

### Geração estática

O script:

```text
scripts/generate-static-pages.mjs
```

utiliza:

```text
dist/index.html
```

como modelo para gerar as páginas físicas.

### Validação pós-build

O script:

```text
scripts/validate-ssg-output.mjs
```

verifica a consistência do artefato antes de permitir sua publicação.

Qualquer falha em uma das etapas encerra o processo com código diferente de zero.

## Estrutura gerada

Exemplo simplificado:

```text
dist/
├── index.html
├── 404.html
├── produtos/
│   ├── index.html
│   ├── camiseta-chouga-jeff/
│   │   └── index.html
│   └── outro-produto/
│       └── index.html
├── sobre/
│   └── index.html
├── contato/
│   └── index.html
├── em-breve/
│   └── index.html
├── assets/
└── ssg-manifest.json
```

Os arquivos compilados de JavaScript, CSS, fontes e imagens permanecem compartilhados em:

```text
dist/assets/
```

Os assets não são duplicados para cada rota.

## Rotas fixas

As seguintes rotas possuem páginas físicas:

```text
/
/produtos
/sobre
/contato
/em-breve
```

Cada rota possui:

- título próprio;
- descrição própria;
- URL canônica própria;
- metadados Open Graph;
- referência aos mesmos assets compilados pelo Vite.

## Rotas de produtos

Cada produto ativo com slug válido gera uma página em:

```text
/produtos/:slug
```

Exemplo:

```text
/produtos/camiseta-chouga-jeff
```

gera:

```text
dist/produtos/camiseta-chouga-jeff/index.html
```

Produtos inativos não devem gerar páginas.

## Consulta ao Supabase

Durante o build, o gerador consulta a view:

```text
produtos_catalogo
```

A consulta considera somente registros com:

```text
ativo = true
```

São utilizadas apenas variáveis públicas compatíveis com o frontend e com o processo de build.

Variáveis necessárias:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

A chave `service_role` nunca deve ser utilizada.

O processo não registra os valores das variáveis no console e não inclui credenciais no manifesto ou nos arquivos gerados.

O build deve falhar quando:

- a URL do Supabase não estiver disponível;
- a chave pública não estiver disponível;
- a consulta falhar;
- o catálogo não puder ser carregado;
- os dados retornados forem incompatíveis com a geração.

## Validação de slugs

Slugs provenientes do catálogo são tratados como entrada não confiável.

O formato aceito é:

```text
letras minúsculas
números
hífens
```

Exemplo válido:

```text
camiseta-chouga-jeff
```

O build rejeita slugs com condições como:

- valor vazio;
- espaços;
- `.` ou `..`;
- barras;
- barras invertidas;
- query strings;
- hashes;
- caracteres não permitidos;
- tentativa de path traversal;
- duplicidade;
- colisão de caminho.

Um slug inválido interrompe o build antes da publicação.

## Metadados

Cada página gerada possui metadados específicos.

Metadados utilizados:

```html
<title>
<meta name="description">
<meta property="og:title">
<meta property="og:description">
<meta property="og:type">
<meta property="og:url">
<meta property="og:image">
<link rel="canonical">
```

As URLs canônicas e Open Graph são absolutas.

Páginas internas não devem apontar sua canonical para a Home.

Os valores provenientes do catálogo são escapados antes de serem inseridos no HTML para evitar quebra do documento ou injeção de marcação.

## Manifesto

O gerador cria:

```text
dist/ssg-manifest.json
```

O manifesto registra:

- quantidade de rotas fixas;
- quantidade de rotas de produtos;
- lista ordenada de todas as rotas geradas.

Exemplo:

```json
{
  "staticRoutes": 5,
  "productRoutes": 20,
  "routes": [
    "/",
    "/contato",
    "/em-breve",
    "/produtos",
    "/produtos/camiseta-chouga-jeff",
    "/sobre"
  ]
}
```

O manifesto:

- utiliza ordenação determinística;
- não contém dados administrativos;
- não contém credenciais;
- não contém o catálogo completo;
- é usado pela validação pós-build;
- é usado pelo GitHub Actions para gerar o resumo do build.

## Validação pós-build

O processo de validação verifica, entre outros pontos:

- existência das páginas obrigatórias;
- existência do manifesto;
- correspondência entre manifesto e arquivos;
- quantidade de rotas;
- existência de páginas de produtos;
- presença de título;
- presença de descrição;
- presença e unicidade da canonical;
- presença de `og:url`;
- referências válidas para JavaScript e CSS;
- ausência de HTML vazio;
- ausência de caminhos inválidos;
- consistência entre rotas e diretórios.

Qualquer inconsistência impede a publicação.

## Página não encontrada

O arquivo:

```text
public/404.html
```

é copiado pelo Vite para:

```text
dist/404.html
```

Ele é utilizado pelo GitHub Pages quando uma URL não corresponde a um arquivo físico publicado.

O comportamento antigo de:

```text
404.html
    ↓
sessionStorage
    ↓
redirecionamento para /
    ↓
restauração da URL no main.jsx
```

foi removido.

O `404.html` atual é uma página independente e explícita, contendo:

- título de página não encontrada;
- instrução para o usuário;
- `noindex`;
- link para a Home;
- link para o catálogo.

Rotas inválidas acessadas durante a navegação interna continuam sendo tratadas pelo React Router.

## Rotas legadas

As rotas antigas:

```text
/camisetas
/blusas
```

não fazem mais parte do fluxo principal do catálogo.

A navegação e os filtros devem utilizar a rota consolidada:

```text
/produtos
```

com os parâmetros de categoria definidos pela aplicação.

A remoção do fluxo legado evita duplicidade de páginas, rotas e fontes de catálogo.

## GitHub Actions

O workflow de deploy está localizado em:

```text
.github/workflows/deploy.yml
```

O pipeline executa:

```text
npm ci
npm run lint
npm run build
```

O comando `npm run build` já inclui:

- compilação do cliente;
- geração das páginas estáticas;
- validação do artefato.

Após o build, o workflow verifica a existência de:

```text
dist/ssg-manifest.json
```

e registra no resumo do GitHub Actions:

- quantidade de rotas fixas;
- quantidade de páginas de produtos;
- total de rotas geradas.

Somente a pasta:

```text
Chouga-online/dist
```

é enviada ao GitHub Pages.

Se a geração, a consulta ao catálogo, a validação ou a leitura do manifesto falhar, o deploy é interrompido.

## Variáveis de ambiente

### Desenvolvimento local

As variáveis podem ser configuradas em:

```text
.env.local
```

Exemplo de nomes:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_CLARITY_PROJECT_ID
VITE_GA_MEASUREMENT_ID
```

O arquivo `.env.local` não deve ser versionado.

### GitHub Actions

As variáveis do Supabase são disponibilizadas ao processo de build pelo repositório ou pelo ambiente `github-pages`.

As variáveis de Analytics e Clarity também são injetadas durante o build.

Nenhum valor deve ser escrito diretamente no workflow, nos logs ou na documentação.

## Testes locais

As validações mínimas antes de um commit são:

```bash
npm run lint
npm run build
```

O build deve apresentar um resumo semelhante a:

```text
[SSG] 5 rotas estáticas geradas com sucesso.
[SSG] 20 páginas de produto geradas com sucesso.
[SSG] Manifesto gerado com 25 rotas.
[SSG Validate] Artefato validado com 25 rotas.
```

Também devem ser verificados:

```powershell
Test-Path .\dist\produtos\index.html
Test-Path .\dist\sobre\index.html
Test-Path .\dist\contato\index.html
Test-Path .\dist\em-breve\index.html
Test-Path .\dist\404.html
Test-Path .\dist\ssg-manifest.json
```

O conteúdo de `dist` deve ser testado com um servidor estático que não aplique automaticamente fallback de SPA.

O `vite preview` pode implementar comportamentos diferentes do GitHub Pages e não deve ser a única forma de validação das rotas físicas.

## Produtos novos, alterados e removidos

O conteúdo estático representa o catálogo existente no momento do build.

### Produto novo

Um produto novo somente terá uma página física depois de um novo build e deploy.

### Alteração de slug

Uma alteração de slug exige novo build.

A URL anterior deixa de ser gerada no próximo artefato.

### Produto inativado ou removido

Um produto inativado ou removido deixa de gerar página no próximo build.

Como o Vite recria a pasta `dist`, páginas antigas não devem permanecer no novo artefato.

### Alteração de conteúdo

Mudanças em nome, descrição ou imagem utilizadas pelos metadados exigem novo build para atualizar o HTML físico.

## Analytics e Microsoft Clarity

Google Analytics e Microsoft Clarity continuam sujeitos ao consentimento de cookies analíticos.

As páginas físicas não devem causar inicialização duplicada das ferramentas.

Após o carregamento inicial, o rastreamento de navegação interna continua sendo realizado pela integração da SPA.

Após o deploy, devem ser validados:

- acesso direto a cada rota;
- pageview da rota correta;
- ausência de pageview duplicado;
- preservação de query strings;
- preservação de hashes;
- comportamento após atualização da página.

## Limitações do GitHub Pages

O GitHub Pages é uma hospedagem de arquivos estáticos.

Por isso:

- não existe SSR em tempo real;
- não existe processamento de rotas no servidor;
- um produto novo exige novo deploy;
- URLs inexistentes são atendidas pelo `404.html`;
- não é possível controlar livremente o status HTTP de todas as experiências de erro;
- redirecionamentos avançados dependem das limitações da plataforma;
- o conteúdo HTML representa o estado do catálogo durante o build.

## Rollback

Em caso de falha após a publicação:

1. identificar o commit ou Pull Request responsável;
2. reverter as alterações relacionadas ao SSG;
3. restaurar o comando anterior de build, quando necessário;
4. restaurar o fallback anterior somente se a arquitetura estática precisar ser desativada;
5. executar novamente:

```bash
npm run lint
npm run build
```

6. publicar um novo artefato;
7. validar as rotas principais;
8. registrar o motivo do rollback na issue correspondente.

O histórico do fallback anterior está documentado na issue `#271`.

## Validação em produção

Após a publicação, testar no mínimo:

```text
/
/produtos
/sobre
/contato
/em-breve
/produtos/:slug
/rota-inexistente
/produtos/produto-inexistente
```

Para cada rota válida:

- abrir em janela anônima;
- atualizar a página;
- confirmar permanência na URL;
- confirmar carregamento dos assets;
- confirmar ausência de redirecionamento para `/`;
- verificar título;
- verificar descrição;
- verificar canonical;
- verificar Open Graph;
- verificar erros no console.

## Lighthouse

Após o deploy, o Lighthouse deve ser executado individualmente nas principais rotas, em desktop e mobile.

Validar especialmente:

```text
requestedUrl
mainDocumentUrl
finalDisplayedUrl
finalUrl
```

A rota auditada deve permanecer como o documento principal, sem redirecionamento inicial para `/`.

Os resultados de desempenho, acessibilidade, boas práticas e SEO devem ser registrados nas issues correspondentes.

## Relação com as issues

### Issue #268

Investigação de desempenho real, incluindo CLS, INP, Core Web Vitals e auditorias por rota.

### Issue #271

Implementação e documentação do fallback anterior da SPA no GitHub Pages.

### Issue #272

Implementação do SSG personalizado, geração das páginas físicas, validação do artefato, revisão do fallback e integração ao pipeline de deploy.

## Fora de escopo

Esta arquitetura não realiza:

- migração para Next.js;
- migração para outro provedor;
- SSR em tempo real;
- substituição do Supabase;
- criação de novo CMS;
- otimização completa de imagens;
- correção automática de Core Web Vitals;
- deploy automático acionado por alterações no catálogo.
