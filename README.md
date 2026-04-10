# Form Builder

Um construtor de formulários drag-and-drop intuitivo e moderno, desenvolvido com Next.js. Permite criar, editar, publicar e gerenciar formulários de forma visual, com análise de submissões e compartilhamento fácil.

## 🚀 Funcionalidades

- **Drag-and-Drop Designer**: Interface visual para montar formulários arrastando elementos.
- **Elementos Diversos**: Campos de texto, títulos, parágrafos, separadores e espaçadores.
- **Publicação e Compartilhamento**: Publique formulários com links únicos para coleta de respostas.
- **Análises Integradas**: Acompanhe visitas, submissões e taxas de conversão.
- **Autenticação Segura**: Login/signup com Clerk para proteger dados do usuário.
- **Responsivo**: Formulários funcionam em desktop e mobile.
- **Validação em Tempo Real**: Usando Zod e React Hook Form.

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI/UX**: Radix UI, TailwindCSS, Lucide Icons
- **Drag-and-Drop**: @dnd-kit
- **Autenticação**: Clerk
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Validação**: Zod, React Hook Form
- **Outros**: next-themes, Sonner, Recharts

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou cloud, e.g., Neon, Supabase)
- Conta no [Clerk](https://clerk.com) para autenticação

## 🏗️ Instalação e Setup

1. **Clone o repositório**:

   ```bash
   git clone <url-do-repo>
   cd form-builder
   ```

2. **Instale dependências**:

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configure o Banco de Dados**:

   - Crie um banco PostgreSQL.
   - Copie `.env.example` para `.env.local` e configure:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/formbuilder"
     ```

4. **Configure o Prisma**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Configure o Clerk**:

   - Crie um app no Clerk e obtenha as chaves.
   - Adicione ao `.env.local`:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
     ```

6. **Rode o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000).

## 📖 Como Usar

### Criando um Formulário

1. Faça login/signup.
2. No dashboard, clique em "Criar Formulário".
3. Use o designer: Arraste elementos da barra lateral esquerda para o canvas.
4. Configure propriedades no painel direito.
5. Salve e publique o formulário.

### Publicando e Compartilhando

- Clique em "Publicar" para gerar um link único (e.g., `/submit/uuid`).
- Compartilhe o link; visitantes podem preencher e submeter.

### Visualizando Análises

- No dashboard, veja métricas totais (visitas, submissões, taxas).
- Em cada formulário, acesse detalhes e submissões individuais.

## 📁 Estrutura do Projeto

```
form-builder/
├── app/                    # Rotas Next.js (dashboard, builder, submit)
├── src/
│   ├── components/         # Componentes React (Designer, FormElements, etc.)
│   ├── lib/                # Utilitários (Prisma client, utils)
│   └── schemas/            # Validações Zod
├── prisma/                 # Schema e migrations do banco
├── actions/                # Server actions (CRUD de formulários)
└── public/                 # Assets estáticos
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento.
- `npm run build` - Build para produção.
- `npm run start` - Inicia o servidor de produção.
- `npm run lint` - Executa ESLint.
- `npx prisma studio` - Abre o Prisma Studio para visualizar o banco.

## 🤝 Contribuição

1. Fork o projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

### Adicionando Novos Elementos

- Edite `src/components/FormElements.tsx` para registrar novos tipos.
- Crie componentes em `src/components/fields/` seguindo a interface `FormElement`.

## 📄 Licença

Este projeto é licenciado sob a MIT License. Veja [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no GitHub ou entre em contato via [email].

---

Feito com ❤️ usando Next.js e Clean Architecture em mente.
