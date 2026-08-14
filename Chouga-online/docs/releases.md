# Releases

## Objetivo

Documentar o fluxo oficial de versionamento e publicação do Chouga Online.

O projeto utiliza `semantic-release` para:

- calcular automaticamente a próxima versão;
- gerar as notas de release;
- atualizar o `CHANGELOG.md`;
- criar a tag correspondente;
- publicar a release no GitHub.

A publicação ocorre somente a partir da branch `main`.

---

## Fluxo oficial

O fluxo adotado pelo projeto é:

```text
Issue
  ↓
Branch
  ↓
Commits de desenvolvimento
  ↓
Pull Request
  ↓
Squash and merge
  ↓
Um único commit convencional na main
  ↓
semantic-release
  ↓
CHANGELOG + tag + GitHub Release
```

Uma Pull Request representa uma entrega.

A branch pode conter vários commits de desenvolvimento, mas a `main` deve
receber apenas um commit final por Pull Request.

---

## Estratégia de merge

O repositório utiliza exclusivamente:

```text
Squash and merge
```

As opções abaixo permanecem desabilitadas:

```text
Merge commits
Rebase merging
```

O GitHub está configurado para utilizar:

```text
Pull request title
```

como mensagem padrão do commit criado pelo squash.

Branches já mescladas são removidas automaticamente pelo GitHub.

---

## Título da Pull Request

O título da Pull Request deve seguir o padrão Conventional Commits.

Exemplos válidos:

```text
feat: adicionar seletor de tema
fix: normalizar geração das notas de release
perf: otimizar carregamento da imagem principal
refactor: centralizar utilitários do catálogo
docs: documentar fluxo de releases
```

Evitar títulos genéricos:

```text
Atualizações
Correções
Ajustes finais
Issue 295
Melhorias
```

O título da Pull Request será utilizado como mensagem do commit que entrará na
branch `main`.

Por isso, o título da PR faz parte diretamente do pipeline de release.

---

## Referência às issues

A referência de fechamento deve permanecer na descrição da Pull Request.

Exemplo:

```text
Closes #295
```

Não repetir a mesma referência no corpo do commit final de squash.

O GitHub está configurado para fechar automaticamente issues vinculadas após o
merge da Pull Request.

---

## Commits durante o desenvolvimento

Os commits da branch podem continuar registrando a evolução da implementação.

Exemplo:

```text
docs: documentar padrão de squash (#295)
test: validar geração das notas de release (#295)
fix: ajustar fluxo de release (#295)
```

Esses commits não devem chegar individualmente à `main`.

Durante o `Squash and merge`, eles são consolidados em um único commit.

---

## Commit final esperado

Exemplo de Pull Request:

```text
fix: normalizar geração das notas de release
```

Após o squash, a `main` deve receber algo equivalente a:

```text
fix: normalizar geração das notas de release (#PR)
```

O corpo automático contendo a lista completa dos commits intermediários não
deve ser mantido.

### Motivo

Na release `v1.21.0`, o commit de squash manteve vários commits intermediários
referenciando a mesma issue.

O `release-notes-generator` interpretou essas referências e produziu múltiplos
links repetidos para a mesma issue.

Manter apenas o título da Pull Request no commit final evita esse comportamento.

---

## Versionamento

O `semantic-release` determina automaticamente a próxima versão com base no
tipo do commit.

| Tipo       | Incremento |
| ---------- | ---------- |
| `feat`     | minor      |
| `fix`      | patch      |
| `perf`     | patch      |
| `refactor` | patch      |
| `style`    | patch      |
| `docs`     | patch      |
| `build`    | patch      |
| `ci`       | patch      |

Exemplos:

```text
1.21.0 + fix  → 1.21.1
1.21.0 + feat → 1.22.0
```

O versionamento continua seguindo SemVer.

---

## Geração das notas

As notas são geradas automaticamente por:

```text
@semantic-release/release-notes-generator
```

Os commits convencionais são classificados em seções como:

```markdown
### Features

- adicionar seletor de tema (#PR)

### Bug Fixes

- corrigir geração das notas de release (#PR)
```

A edição manual das notas de cada release não faz parte do fluxo normal.

---

## Dependência protegida

O projeto utiliza:

```json
"conventional-changelog-conventionalcommits": "9.3.1"
```

A versão está fixada intencionalmente, sem `^`.

Uma atualização anterior para uma versão mais recente resultou em releases com
versão calculada corretamente, porém com notas vazias.

Por isso:

> **Não atualizar `conventional-changelog-conventionalcommits` sem uma issue
> específica, investigação isolada e validação completa do pipeline de release.**

Também deve ser evitado o uso indiscriminado de comandos como:

```bash
npm update
```

quando puderem alterar essa dependência.

---

## Configuração atual

O projeto utiliza:

```text
semantic-release                          ^25.0.7
@semantic-release/commit-analyzer         ^13.0.1
@semantic-release/release-notes-generator ^14.1.1
@semantic-release/changelog               ^6.0.3
@semantic-release/git                     ^10.0.1
@semantic-release/github                  ^12.0.9
conventional-changelog-conventionalcommits 9.3.1
```

A configuração principal está em:

```text
.releaserc.json
```

O workflow responsável pela publicação está em:

```text
.github/workflows/release.yml
```

---

## Validação local

O comando básico de validação é:

```powershell
npx semantic-release --dry-run
```

Como o projeto publica releases somente a partir da branch `main`, ao executar
esse comando em uma branch de desenvolvimento o processo pode ser encerrado
antes da análise completa da próxima versão.

Para investigar uma branch específica sem alterar o `.releaserc.json`, pode ser
utilizado:

```powershell
npx semantic-release --dry-run --no-ci --branches "nome-da-branch" --debug
```

Esse comando permite verificar:

- carregamento da configuração;
- plugins utilizados;
- branch considerada;
- tags encontradas;
- regras de versionamento.

### Limitação do ambiente local

O plugin `@semantic-release/github` exige `GH_TOKEN` ou `GITHUB_TOKEN` durante
a etapa `verifyConditions`.

Não é necessário criar um token pessoal apenas para realizar essa investigação
local.

O workflow oficial do GitHub Actions fornece automaticamente:

```text
GITHUB_TOKEN
```

durante a execução do `semantic-release`.

---

## Validação final

Antes de concluir alterações relacionadas ao sistema de releases, confirmar:

- o título da Pull Request segue Conventional Commits;
- o squash utiliza somente o título da Pull Request;
- não existem referências repetidas à mesma issue no commit final;
- `feat` continua gerando versão minor;
- `fix` continua gerando versão patch;
- as notas continuam sendo agrupadas corretamente;
- o `CHANGELOG.md` continua sendo atualizado;
- a tag continua sendo criada automaticamente;
- a GitHub Release continua sendo publicada;
- `conventional-changelog-conventionalcommits` permanece na versão `9.3.1`.

---

## Checklist antes do merge

Antes de utilizar `Squash and merge`:

- [ ] O título da PR segue Conventional Commits.
- [ ] A descrição contém `Closes #issue`.
- [ ] O commit de squash utiliza somente o título da PR.
- [ ] A lista automática de commits intermediários não foi mantida.
- [ ] Nenhuma dependência do pipeline foi alterada sem necessidade.

---

## Regra principal

> Uma Pull Request representa uma entrega.
>
> A branch pode conter vários commits de trabalho.
>
> A `main` recebe um único commit convencional, limpo e descritivo.
