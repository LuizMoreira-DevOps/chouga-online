# Política de Segurança

## Escopo

Esta política se aplica ao código, às integrações, aos workflows, às configurações e aos serviços relacionados ao projeto Chouga Online.

## Relato de vulnerabilidades

Caso seja identificada uma possível vulnerabilidade, falha de configuração, exposição de dados ou comportamento inseguro, evite publicar detalhes em Issues, Pull Requests ou discussões públicas.

O relato deve conter, sempre que possível:

- descrição objetiva do problema;
- componente afetado;
- passos para reprodução;
- impacto observado ou potencial;
- evidências técnicas sem exposição de dados sensíveis;
- sugestão de correção, quando aplicável.

## Divulgação responsável

Informações sobre vulnerabilidades não devem ser divulgadas publicamente antes da análise e da aplicação de medidas corretivas.

Relatos feitos de boa-fé serão avaliados com atenção.

## Integridade do projeto

Não devem ser enviados ao repositório:

- credenciais;
- tokens;
- senhas;
- chaves privadas;
- arquivos `.env`;
- dados pessoais;
- informações internas da infraestrutura;
- conteúdos de terceiros sem autorização.

Alterações propostas devem preservar:

- a estabilidade da aplicação;
- a segurança das integrações;
- a integridade dos dados;
- a identidade visual do projeto;
- o histórico de versionamento;
- os processos de validação e deploy.

## Dependências

As dependências e integrações do projeto podem ser atualizadas periodicamente para correção de vulnerabilidades, compatibilidade e estabilidade.

# Monitoramento de segurança

O projeto utiliza um workflow do GitHub Actions para monitoramento básico dos logs de acesso do Supabase.

O monitoramento consulta periodicamente os `edge_logs` por meio da Supabase Management API e procura eventos HTTP considerados relevantes para segurança.

## Fluxo

```text
Supabase
   ↓
edge_logs
   ↓
GitHub Actions
   ↓
classificação por severidade
   ↓
Discord (#chouga-security)
```

O workflow é executado automaticamente em intervalos de aproximadamente cinco minutos e também pode ser iniciado manualmente pelo GitHub Actions.

## Classificação

Os eventos monitorados são classificados da seguinte forma:

- **Warning:** respostas HTTP `401` e `403`;
- **Critical:** respostas HTTP `5xx`;
- respostas comuns, como `2xx`, não geram alertas de segurança;
- erros genéricos como `400` e `404` não fazem parte do alerta inicial, reduzindo falsos positivos.

Quando nenhum evento relevante é encontrado, nenhuma notificação é enviada.

## Alertas

Quando um evento relevante é identificado, o workflow envia um resumo para o canal privado de segurança no Discord.

O alerta informa, quando disponível:

- severidade;
- quantidade de eventos encontrados;
- código HTTP;
- método da requisição;
- endpoint acessado;
- timestamp do evento.

As notificações são agregadas por execução para evitar excesso de mensagens.

## Credenciais

O workflow utiliza secrets do GitHub Actions para acessar as integrações necessárias.

As seguintes informações não devem ser adicionadas diretamente ao código ou versionadas no repositório:

- token de acesso da Supabase Management API;
- referência sensível de configuração do projeto;
- URL do webhook do Discord;
- chaves privilegiadas do Supabase.

A aplicação frontend utiliza somente a chave pública apropriada (`sb_publishable_...`).

Chaves privilegiadas, incluindo `service_role` e `sb_secret_...`, não devem ser expostas no bundle do frontend.

## Objetivo e limitações

Este monitoramento fornece uma camada básica de observabilidade e alerta para o projeto.

Ele não substitui ferramentas especializadas de SIEM, IDS/IPS ou monitoramento de infraestrutura e não deve ser tratado como mecanismo único de detecção de incidentes.

O objetivo é identificar rapidamente padrões relevantes de acesso não autorizado ou falhas do serviço sem gerar volume excessivo de falsos positivos.

## Limitações

O projeto é mantido em desenvolvimento contínuo. A existência desta política não representa garantia de ausência de falhas ou resposta dentro de prazo específico.
