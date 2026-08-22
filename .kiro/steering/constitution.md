# Project Constitution — formularios

Contrato arquitetural do projeto **formularios**.
Governa toda decisão de implementação feita por desenvolvedores e agentes de código.

> **Subordinação:** Este documento é subordinado à **Platform Constitution**
> (`../../PLATFORM.md`). Em caso de conflito, a Platform Constitution prevalece.

**Hierarquia de autoridade:**

1. Platform Constitution (`../../PLATFORM.md`)
2. Esta Constitution (este documento)
3. Convenções arquiteturais existentes no projeto
4. Especificação de feature
5. Convenções do ecossistema/linguagem
6. Conveniência de implementação

---

## 1. Propósito do Projeto

O **formularios** é uma aplicação externa à plataforma de automação de workflows.
Seu papel é:

- Permitir que usuários criem formulários dinâmicos (drag-and-drop)
- Publicar formulários via link compartilhável
- Coletar submissões de visitantes anônimos
- Exibir analytics sobre submissões
- **Integrar-se com a plataforma de flows**: disparar eventos via API/webhook
  quando ações relevantes ocorrem (submissão, publicação, etc.)

O formularios possui **banco de dados próprio** e se integra com o flow-runner
exclusivamente via webhook, conforme definido na Platform Constitution §3.

---

## 2. Stack

| Concern | Tecnologia |
|---|---|
| Framework | Next.js 15+ (App Router) |
| React | 19 |
| Linguagem | TypeScript (strict) |
| UI | shadcn/ui (new-york style) + Tailwind CSS v4 |
| Drag & Drop | @dnd-kit |
| Auth | Clerk (`@clerk/nextjs`) |
| ORM | Prisma + PostgreSQL |
| Validação | Zod |
| Forms | React Hook Form + Zod resolver |
| Charts | Recharts (via shadcn/ui chart) |
| i18n | i18next + react-i18next |
| Testes | Vitest (unit) + Playwright (e2e) |

---

## 3. Arquitetura em Camadas

O projeto DEVE seguir uma arquitetura em camadas com direção de dependência
de fora para dentro.

```
app/                → Delivery layer (rotas, layouts, Server Components, Server Actions)
src/actions/        → Application layer (thin wrappers que delegam para use cases)
src/use-cases/      → Business logic (orquestração de regras de negócio)
src/repositories/   → Data access abstractions (interfaces)
src/infra/          → Implementações concretas (Prisma, HTTP clients, Clerk adapter)
src/domain/         → Entidades, tipos, enums, schemas de validação
src/components/     → Componentes React (presentacional)
src/lib/            → Utilitários cross-cutting
```

### 3.1 — Regras de dependência

- `src/use-cases/` NÃO DEVE importar de Prisma, Clerk, Next.js, ou React.
- `src/repositories/` define INTERFACES. Implementações concretas vivem em `src/infra/`.
- `app/` e `src/actions/` PODEM importar de qualquer camada (são a delivery layer).
- `src/components/` NÃO DEVE acessar banco ou executar lógica de negócio diretamente.
- `src/domain/` NÃO DEVE importar de nenhuma outra camada.

### 3.2 — Server Actions como delegadores

Server Actions DEVEM seguir o padrão:

1. Autenticar (Clerk `currentUser()`)
2. Validar input (Zod)
3. Delegar para um Use Case
4. Retornar resultado tipado

Server Actions NÃO DEVEM:
- Conter queries Prisma diretamente
- Acumular lógica condicional de negócio
- Ter mais de ~30 linhas de código

---

## 4. Convenções de Código

### 4.1 — Naming

| Elemento | Convenção | Exemplo |
|---|---|---|
| Funções (actions, use cases) | camelCase | `createForm`, `getFormStats` |
| Componentes React | PascalCase | `FormBuilder`, `TextField` |
| Arquivos de componentes | PascalCase.tsx | `FormBuilder.tsx` |
| Arquivos de lógica | kebab-case.ts | `create-form.ts` |
| Interfaces/Types | PascalCase | `FormRepository`, `CreateFormInput` |
| Constantes | UPPER_SNAKE_CASE | `MAX_FORM_ELEMENTS` |

### 4.2 — Organização de Form Fields

Cada tipo de campo (field) DEVE seguir o padrão do registry:

```
src/components/fields/
├── index.ts                    (registry + types)
├── TextField.tsx
├── NumberField.tsx
├── SelectField.tsx
└── ...
```

Cada field exporta um objeto `FormElement` com:
- `type` — identificador único
- `construct(id)` — factory
- `designerBtnElement` — botão na sidebar
- `designerComponent` — renderização no canvas
- `formComponent` — renderização no formulário publicado
- `propertiesComponent` — painel de propriedades
- `validateFormElement(element, value)` — validação server+client

### 4.3 — Schemas compartilhados

Schemas Zod para validação de campos DEVEM viver em `src/domain/schemas/fields/`
e ser reutilizáveis tanto no client quanto no server.

---

## 5. Validação

### 5.1 — Toda entrada DEVE ser validada

Todo input de Server Action ou API Route DEVE ser validado com Zod antes de
qualquer processamento. Inputs não validados são uma violação.

### 5.2 — JSON tipado

Campos que armazenam JSON no banco (`content`, `metadata`) DEVEM ser parseados
com Zod schema na leitura. O tipo `string` do Prisma NÃO É suficiente como
garantia de estrutura.

### 5.3 — Validação de negócio no Use Case

A validação de regras de negócio (ex: "formulário já publicado não pode ser
editado") DEVE ocorrer no Use Case, não na Action nem no componente.

---

## 6. Error Handling

### 6.1 — Result Pattern

Use Cases DEVEM retornar resultados tipados, NUNCA lançar exceptions para
erros de negócio esperados.

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

### 6.2 — Erros inesperados

Erros de infraestrutura (falha de conexão, timeout) PODEM ser exceções.
Server Actions DEVEM capturá-los e retornar um Result com error genérico.

### 6.3 — Sem swallow silencioso

Erros NÃO DEVEM ser engolidos. Todo catch DEVE logar ou retornar o erro.
`console.log` NÃO DEVE ser usado em produção — usar structured logging quando
necessário.

---

## 7. Autenticação e Autorização

### 7.1 — Clerk como provider

Clerk fornece autenticação. Objetos do Clerk NÃO DEVEM vazar para use cases.
O userId (string) é o que cruza a fronteira.

### 7.2 — Ownership validation

Toda operação sobre um recurso (form, submission) DEVE verificar que o
`userId` autenticado é o owner do recurso. Essa verificação é obrigatória
no Use Case (não apenas no frontend).

### 7.3 — Rotas públicas

Apenas estas rotas são públicas (sem auth):
- `/submit/[shareUrl]` — submissão de formulário
- `/api/track-abandon` — beacon de abandono
- `/sign-in`, `/sign-up` — auth

Todas as demais DEVEM ser protegidas via middleware.

---

## 8. Integração com a Plataforma de Flows

### 8.1 — Webhook como mecanismo

Quando um evento relevante ocorre (ex: formulário submetido), o formularios
DEVE poder disparar um webhook para o flow-runner.

### 8.2 — Eventos suportados

| Evento | Quando dispara |
|---|---|
| `form.submitted` | Visitante submete um formulário publicado |
| `form.published` | Dono publica um formulário |
| `form.created` | Dono cria um novo formulário |

### 8.3 — Formato do payload

Conforme Platform Constitution §3.2:

```json
{
  "event": "form.submitted",
  "timestamp": "2026-08-22T12:00:00.000Z",
  "source": "formularios",
  "data": {
    "formId": 123,
    "formName": "Contato",
    "submissionId": 456,
    "content": { ... }
  }
}
```

### 8.4 — Configuração

O webhook URL e secret DEVEM ser configuráveis via variáveis de ambiente:
- `FLOW_WEBHOOK_URL` — URL do endpoint no flow-runner
- `FLOW_WEBHOOK_SECRET` — secret para header `X-Webhook-Secret`

O disparo de webhook DEVE ser fire-and-forget (não bloquear a resposta do
submit). Falhas no webhook NÃO DEVEM impedir a submissão.

---

## 9. Testes

### 9.1 — Obrigatórios

Todo Use Case DEVE ter testes unitários.
Toda validação de campo (field) DEVE ter testes.
Server Actions com lógica DEVEM ter testes de integração.

### 9.2 — Stack de testes

- **Unit**: Vitest (mesmo do flow-builder)
- **E2E**: Playwright (quando necessário)

### 9.3 — Localização

Testes unitários ficam ao lado do arquivo: `<nome>.spec.ts`.
Testes e2e ficam em `tests/e2e/`.

---

## 10. Internacionalização

### 10.1 — Todo texto visível DEVE ser internacionalizado

Nenhuma string hardcoded na UI. Usar `useTranslation()` (client) ou
`getServerT()` (server).

### 10.2 — Idiomas suportados

- `pt` (padrão)
- `en`
- `es`

### 10.3 — Estrutura de recursos

Recursos de tradução vivem em `shared/i18n/resources.ts`.
Ao adicionar texto visível, TODAS as 3 traduções DEVEM ser adicionadas no
mesmo PR.

---

## 11. Segurança

### 11.1 — Secrets via ambiente

Nenhum secret no código. `.env` não commitado. `.env.example` commitado com
nomes das variáveis (sem valores).

### 11.2 — Rate limiting em rotas públicas

Rotas públicas (`/submit`, `/api/track-abandon`) DEVEM ter rate limiting
para prevenir abuso.

### 11.3 — Sanitização de input

Conteúdo submetido por visitantes anônimos DEVE ser tratado como não-confiável.
Sanitizar antes de persistir e antes de renderizar.

---

## 12. Infraestrutura

### 12.1 — Dockerfile obrigatório

O projeto DEVE ter um Dockerfile multi-stage para produção.

### 12.2 — Variáveis de ambiente

Toda configuração externa DEVE ser via env vars:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `FLOW_WEBHOOK_URL`
- `FLOW_WEBHOOK_SECRET`

### 12.3 — Health check

A aplicação DEVE expor `/api/health` retornando `200 OK` para
orquestração de containers.

---

## 13. Definition of Done

Uma feature é considerada completa quando:

- Requisitos satisfeitos
- Camadas arquiteturais respeitadas
- Testes unitários passam
- Validação de input implementada
- Verificação de ownership implementada (se aplicável)
- i18n completo (3 idiomas)
- Sem `console.log` de debug
- Sem `any` sem justificativa documentada
- A spec reflete o comportamento implementado

---

## 14. Git Workflow

Toda feature DEVE seguir um workflow Git dedicado para manter rastreabilidade.

### 14.1 — Branch naming

```
<type>/<issue-number>/<slug>
```

Tipos permitidos: `feature`, `bug`, `improvement`, `refactor`, `chore`, `docs`, `perf`, `security`

Exemplo: `feature/12/webhook-integration`

O branch DEVE ser criado a partir de `develop` (ou `main` se não houver develop).

### 14.2 — Issue tracking

Toda feature ou bug DEVE ter uma issue no GitHub antes da implementação.

**Flow A** — issue já existe: usar o número para nomear o branch.
**Flow B** — issue não existe: criar a issue antes de criar o branch.

### 14.3 — Commits

Um commit por task/unidade lógica. Mensagem:

```
[<slug>] <descrição curta>
```

Exemplos:
- `[webhook-integration] criar webhook client`
- `[webhook-integration] integrar no submit-form`

### 14.4 — Pull Request

Ao completar o trabalho, abrir PR do feature branch para `develop`/`main`:

- Título: `[<slug>] <resumo de uma linha>`
- Descrição: resumo do que foi feito, issue vinculada (`Closes #N`), limitações conhecidas
- NÃO fazer merge sem review (quando houver equipe)

### 14.5 — Proibições

- NUNCA commitar ou pushar diretamente para `main` ou `develop`
- NUNCA commitar secrets (`.env`, tokens, keys)
- NUNCA usar `--force` sem confirmação explícita

### 14.6 — Fechamento de issue

Ao mergear o PR, a issue vinculada DEVE ser fechada automaticamente via
`Closes #N` na descrição do PR. Se não for automático, fechar manualmente
com comentário explicando o que foi entregue.

---

## 15. Testes

### 15.1 — Cobertura obrigatória

| Camada | Obrigatoriedade |
|---|---|
| Use Cases | OBRIGATÓRIO — todo use case DEVE ter .spec.ts |
| Validações de campo (fields) | OBRIGATÓRIO — toda `validateFormElement` DEVE ser testada |
| Repository (Prisma) | RECOMENDADO — testes de integração quando houver lógica complexa |
| Server Actions | RECOMENDADO — testar o fluxo auth → use case |
| Componentes React | OPCIONAL — priorizar comportamento crítico |
| E2E | RECOMENDADO — fluxo completo create → publish → submit |

### 15.2 — Stack

- **Unit tests**: Vitest
- **E2E**: Playwright
- **Localização**: `<arquivo>.spec.ts` ao lado do arquivo (unit), `tests/e2e/` (e2e)

### 15.3 — Patterns

- Use cases testados com mock de repository (interface facilita)
- Sem dependência de banco, rede ou framework nos testes unitários
- Table-driven tests para validações com múltiplos cenários
- Testes DEVEM ser executáveis com `npx vitest run` sem setup adicional

### 15.4 — Quando escrever testes

- ANTES de considerar a feature completa (não depois)
- Todo bug fix DEVE incluir teste que reproduz o bug
- Toda regra de negócio nova no use case DEVE ter teste correspondente

### 15.5 — Definition of Done atualizada

Uma feature NÃO é completa até que:
- Testes unitários dos use cases passem
- Testes de validação de campos passem
- `npx vitest run` execute sem falhas
- `tsc --noEmit` compile sem erros

---

## 16. Evolução desta Constitution

Esta Constitution é um documento vivo. Mudanças DEVEM ser intencionais e
refletir decisões reais confirmadas durante desenvolvimento.

Quando um padrão se repetir 3+ vezes, ele DEVE ser formalizado aqui.
Quando uma regra não fizer mais sentido, ela DEVE ser removida.
