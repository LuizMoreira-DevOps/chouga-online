<div align="center">

# 🛹 Chouga Skateboard

### Vitrine virtual e experiência digital da Chouga Skateboard

Uma aplicação web criada para apresentar os produtos, a identidade e a cultura da Chouga Skateboard, unindo moda urbana, skate e tecnologia.

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deploy-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

![Release](https://img.shields.io/github/v/release/LuizMoreira-DevOps/chouga-online?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/LuizMoreira-DevOps/chouga-online/deploy.yml?branch=main&style=for-the-badge&label=build)
![Uso](https://img.shields.io/badge/uso-restrito-7A2B2E?style=for-the-badge)

</div>

---

## 📖 Sobre o projeto

O **Chouga Online** é a plataforma digital da Chouga Skateboard, uma marca independente ligada à cultura urbana, ao skate e à comunidade local.

O projeto foi desenvolvido com foco em:

- apresentar o catálogo de produtos da marca;
- permitir a navegação por categorias;
- oferecer filtros dinâmicos de produtos;
- exibir detalhes, imagens e variações disponíveis;
- facilitar pedidos e contatos por WhatsApp;
- construir uma experiência visual inspirada em games e no universo do skate;
- automatizar testes, deploys e releases pelo GitHub Actions.

Mais do que uma vitrine virtual, o projeto busca traduzir a personalidade da Chouga para o ambiente digital.

---

## ✨ Funcionalidades

### Catálogo

- listagem de produtos, como camisetas, blusas e outras peças;
- carregamento de produtos pelo Supabase;
- organização por categorias;
- filtros por tamanho, cor, marca e outros atributos;
- ordenação dinâmica dos tamanhos;
- exibição de produtos e suas variações.

### Experiência do usuário

- layout responsivo;
- visual adaptado para desktop e dispositivos móveis;
- modal de detalhes do produto;
- visualização ampliada das imagens;
- seleção de variações;
- direcionamento para atendimento pelo WhatsApp;
- navegação por rotas com React Router.

### Identidade visual

- estética inspirada em skate e cultura urbana;
- menus experimentais inspirados em jogos clássicos;
- Home Wheels;
- elementos visuais próprios da Chouga;
- fundos, animações e interações temáticas.

### Automação

- verificação automática de lint;
- build automático;
- deploy pelo GitHub Actions;
- releases automáticos;
- versionamento semântico;
- geração automática do `CHANGELOG.md`.

---

## 🧰 Tecnologias

### Front-end

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- CSS modularizado por página e componente

### Interface e animação

- [Framer Motion](https://motion.dev/)
- [Lucide React](https://lucide.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)

### Dados e serviços

- [Supabase](https://supabase.com/)
- PostgreSQL
- Supabase Edge Functions
- Strapi Cloud

### Qualidade e automação

- ESLint
- Stylelint
- HTMLHint
- GitHub Actions
- Semantic Release
- Conventional Commits

### Hospedagem

- GitHub Pages

---

## 🏗️ Arquitetura

O repositório utiliza uma estrutura organizada em diferentes aplicações e serviços:

```text
chouga-online
│
├── .github
│   └── workflows
│       ├── ci.yml
│       ├── deploy.yml
│       └── release.yml
│
├── Chouga-online
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   │
│   ├── .releaserc.json
│   ├── CHANGELOG.md
│   ├── package.json
│   └── vite.config.js
│
├── chouga-cms
│
├── chouga-sync
│
└── README.md
```

---

## 🗺️ Próximas melhorias

- aprimorar a experiência visual da Home;
- evoluir o Deck Menu;
- adicionar animações e efeitos sonoros;
- melhorar acessibilidade;
- ampliar os filtros do catálogo;
- otimizar carregamento de imagens;
- implementar novos recursos administrativos;
- fortalecer a integração entre Strapi e Supabase;
- ampliar testes automatizados;
- melhorar métricas e monitoramento.

---

## 📌 Status do projeto

O projeto está em desenvolvimento contínuo.

Funcionalidades já disponíveis:

- catálogo integrado ao Supabase;
- páginas de camisetas e blusas;
- filtros dinâmicos;
- modal de produtos;
- zoom de imagens;
- integração com WhatsApp;
- layout responsivo;
- deploy automático;
- releases automáticos;
- versionamento semântico.

---

## 💬 Sugestões e contato

Este é um projeto próprio da Chouga Skateboard.

Sugestões, relatos de problemas e propostas de melhoria podem ser encaminhados por meio das Issues do repositório.

O envio de sugestões não concede autorização para reprodução, distribuição ou reutilização do projeto.

---

## 🤖 Uso de inteligência artificial

Durante o desenvolvimento deste projeto, foram utilizadas ferramentas de inteligência artificial generativa como apoio em atividades de planejamento, revisão, documentação, análise de código e sugestão de soluções técnicas.

- **Ferramenta:** ChatGPT
- **Desenvolvedor da ferramenta:** OpenAI
- **Modelo utilizado:** GPT-5.6 Thinking
- **Período de utilização:** 2026
- **Finalidade:** apoio ao planejamento, revisão textual, estruturação da documentação, análise de erros e desenvolvimento de soluções técnicas.

Todo conteúdo sugerido pela ferramenta foi revisado, adaptado, testado e validado pelo desenvolvedor. A inteligência artificial atuou como recurso de apoio, enquanto a autoria, as decisões técnicas e a responsabilidade pelo resultado final permanecem com o responsável pelo projeto.

---

## 👨‍💻 Desenvolvimento

Desenvolvido e mantido por:

**Luiz Fernando Alves Moreira**

GitHub: [@LuizMoreira-DevOps](https://github.com/LuizMoreira-DevOps)

---

## ⚖️ Direitos e uso

Este projeto, seu código-fonte, sua identidade visual, imagens, textos, nomes, artes, componentes e demais elementos pertencem à **Chouga Skateboard**.

A reprodução, modificação, distribuição, publicação ou reutilização, total ou parcial, não é autorizada sem consentimento prévio e expresso.

A disponibilização pública deste repositório não representa concessão de licença de uso.

---

<div align="center">

### Chouga Skateboard

**Desde 2022 • Rua • Skate • Família**

🛹

</div>