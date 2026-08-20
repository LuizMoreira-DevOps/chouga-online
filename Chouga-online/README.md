# Chouga Online

Frontend público da Chouga Skateboard.

A aplicação utiliza React, Vite, React Router e Supabase, com publicação pelo GitHub Pages.

## Tecnologias

- React
- Vite
- React Router
- Supabase
- GitHub Actions
- GitHub Pages
- Microsoft Clarity
- Google Analytics 4

## Desenvolvimento local

Instale as dependências:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

## Validações

Antes de qualquer commit, execute:

```bash
npm run lint
npm run build
```

O build inclui:

1. compilação do cliente com Vite;
2. geração das páginas estáticas;
3. validação do artefato gerado.

## Geração estática

A aplicação utiliza um SSG personalizado para gerar arquivos HTML físicos para as rotas públicas e para os produtos ativos do catálogo.

A documentação completa está disponível em:

[Arquitetura e operação do SSG](./docs/ssg.md)

## Variáveis de ambiente

O projeto utiliza variáveis como:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_CLARITY_PROJECT_ID
VITE_GA_MEASUREMENT_ID
```

Os valores devem ser configurados localmente ou no ambiente do GitHub Actions e nunca devem ser adicionados diretamente ao repositório.

## Deploy

O deploy é realizado pelo workflow:

```text
.github/workflows/deploy.yml
```

Somente a pasta `dist` validada é enviada ao GitHub Pages.
