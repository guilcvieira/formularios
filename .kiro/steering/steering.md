# Steering

Configuração global de contexto para o agente Kiro neste projeto.

## Inclusion Mode

`alwaysApply: true`

A Project Constitution está sempre ativa. Toda geração de código, revisão ou
decisão arquitetural DEVE estar em conformidade com:

[`.kiro/steering/constitution.md`](./constitution.md)

## Sumário para Agentes

Você está trabalhando no **formularios**, um construtor de formulários drag-and-drop
que se integra com a plataforma de automação de flows.

### Stack

| Concern | Tecnologia |
|---|---|
| Framework | Next.js 15+ (App Router) |
| UI | React 19 + shadcn/ui (new-york) + Tailwind CSS v4 |
| Drag & Drop | @dnd-kit |
| Auth | Clerk (`@clerk/nextjs`) |
| ORM | Prisma + PostgreSQL |
| Validação | Zod |
| Forms | React Hook Form + Zod resolver |
| i18n | i18next + react-i18next |
| Testes | Vitest (unit) + Playwright (e2e) |

### Arquitetura

```
app/                → Delivery layer (rotas, layouts, Server Actions)
src/actions/        → Application layer (thin wrappers → use cases)
src/use-cases/      → Lógica de negócio
src/repositories/   → Interfaces de acesso a dados
src/infra/          → Implementações concretas (Prisma, HTTP, Clerk)
src/domain/         → Entidades, tipos, schemas
src/components/     → Componentes React
src/lib/            → Utilitários cross-cutting
```

### Conceitos de Domínio

- **Form** — formulário criado pelo usuário (draft ou published)
- **FormElement** — campo individual dentro de um form (TextField, SelectField, etc.)
- **FormSubmission** — resposta de um visitante a um form publicado
- **FormEvent** — evento de tracking (start, interaction, error, abandon)

### Regras Críticas (referência rápida)

1. Ler `constitution.md` antes de implementar features.
2. Server Actions DEVEM ser thin wrappers que delegam para Use Cases.
3. Use Cases NÃO DEVEM importar de Prisma, Clerk, Next.js ou React.
4. Toda entrada DEVE ser validada com Zod.
5. JSON armazenado como string DEVE ser parseado com schema na leitura.
6. `console.log` NÃO É permitido em produção.
7. Todo texto visível DEVE ser internacionalizado (pt, en, es).
8. Ownership DEVE ser verificado server-side em toda operação sobre recurso.
9. Webhooks para a plataforma de flows usam envelope padrão (Platform Constitution §3.2).
10. Testes são obrigatórios para use cases e validações de campo.

### Componentes shadcn/ui disponíveis (`src/components/ui/`)

accordion · alert-dialog · aspect-ratio · avatar · badge · breadcrumb · button ·
calendar · card · chart · checkbox · collapsible · command · context-menu · dialog ·
drawer · dropdown-menu · form · hover-card · input · label · menubar · navigation-menu ·
pagination · popover · progress · radio-group · resizable · scroll-area · select ·
separator · sheet · sidebar · skeleton · slider · sonner · switch · table · tabs ·
textarea · toast · toggle · toggle-group · tooltip
