# Curso App

Aplicação moderna para plataforma de cursos online construída com:

- **Next.js** - Framework React com renderização servidor
- **Shadcn/UI** - Biblioteca de componentes com tema dark
- **NextAuth** - Autenticação com Google
- **Prisma** - ORM para comunicação com PostgreSQL
- **tRPC** - Comunicação typesafe entre frontend e backend
- **Zustand** - Gerenciamento de estado
- **Stripe** - Gerenciamento de pagamentos e assinaturas

## Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Google Cloud Platform para OAuth
- Conta no Stripe

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/curso_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"
GOOGLE_CLIENT_ID="seu_client_id_do_google"
GOOGLE_CLIENT_SECRET="seu_client_secret_do_google"

# Stripe
STRIPE_SECRET_KEY="sua_chave_secreta_do_stripe"
STRIPE_PUBLISHABLE_KEY="sua_chave_publica_do_stripe"
STRIPE_WEBHOOK_SECRET="seu_webhook_secret_do_stripe"
STRIPE_PRODUCT_ID="seu_id_de_produto_do_stripe"

# Environment
NODE_ENV="development"
```

### Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Utilitários e configurações
- `/src/server` - Lógica de servidor e rotas tRPC
- `/src/providers` - Contextos e providers React
- `/prisma` - Schema e migrações do banco de dados

## Funcionalidades Principais

- Autenticação social com Google
- Dashboard do usuário
- Sistema de assinatura com Stripe
- Gerenciamento de cursos

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia a aplicação em modo de produção
- `npm run lint` - Executa o linter
