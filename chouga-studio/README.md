# Chouga CMS

Sanity Studio utilizado como CMS headless da Chouga Online.

## Arquitetura

- React + Vite: frontend público;
- Sanity: conteúdo editorial e eventos;
- Supabase/PostgreSQL: catálogo e dados operacionais do e-commerce.

## Ambiente Sanity

- Projeto: `Chouga CMS`
- Project ID: `esjkriae`
- Dataset: `production`
- Studio: https://chouga-cms.sanity.studio/

## Desenvolvimento local

```powershell
npm install
npm run dev
```

O Studio local utiliza http://localhost:3333.

## Validação

```powershell
npm run build
npx sanity schemas deploy
```

O schema deve ser validado e implantado depois de qualquer alteração em schemaTypes.

## Publicação do Studio

```powershell
npm run deploy
```

A publicação reutiliza o appId configurado em sanity.cli.js.

## Fluxo editorial de eventos

1. Criar ou editar o evento no Studio.
2. Preencher os campos obrigatórios.
3. Revisar data, horário, fuso e local.
4. Manter como rascunho durante a preparação.
5. Publicar somente quando o conteúdo estiver aprovado.

O frontend exibe eventos confirmados ou adiados cujo término ainda não ocorreu.
Eventos cancelados, encerrados ou mantidos como rascunho não aparecem.

## Integração com o frontend

O frontend utiliza:

```bash
VITE_SANITY_PROJECT_ID=esjkriae
VITE_SANITY_DATASET=production
```

Esses identificadores são públicos. Tokens de leitura ou escrita nunca devem
usar o prefixo VITE_ nem ser versionados.
As mesmas configurações devem existir como Repository Variables nos workflows
do GitHub Actions.

## Resiliência

Se o Sanity estiver indisponível ou não estiver configurado, a página utiliza o
conteúdo local de fallback. O cliente Sanity é carregado sob demanda apenas na
página de Eventos.
