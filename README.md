<h1 align="center">
  Logistics Hub API
</h1>

<p align="center">
  API REST para gerenciamento de entregas de encomendas com autenticação JWT, controle de acesso por perfil (RBAC) e trilha de auditoria automática.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img alt="Express" src="https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white"/>
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-5.19-2D3748?style=flat-square&logo=prisma&logoColor=white"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img alt="Jest" src="https://img.shields.io/badge/Jest-29.7-C21325?style=flat-square&logo=jest&logoColor=white"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white"/>
</p>

---

## Sobre o projeto

O **Logistics Hub** é uma API de gerenciamento logístico que permite o controle completo do ciclo de vida de encomendas — do cadastro à entrega final.

O sistema possui dois perfis de acesso (`sale` e `customer`): funcionários criam e movimentam encomendas, enquanto clientes acompanham o rastreio das suas próprias entregas. Toda mudança de status gera automaticamente um log de auditoria imutável no banco de dados, sem intervenção manual.

---

## Funcionalidades

- **Cadastro e autenticação de usuários** com senha hasheada (bcrypt) e token JWT
- **Controle de acesso por perfil (RBAC)** — rotas protegidas por role `sale` ou `customer`
- **Criação e listagem de encomendas** com vínculo ao cliente dono
- **Atualização de status** via PATCH com validação de Enum (`processing` → `shipped` → `delivered`)
- **Audit Trail automático** — cada mudança de status gera um `DeliveryLog` de forma automática e imutável
- **Rastreio de encomenda** — cliente consulta o histórico completo da sua própria entrega (Resource Ownership)
- **Validação de entrada** com Zod em todas as rotas
- **Testes de integração** com Jest + Supertest cobrindo happy path, erros de negócio e erros de validação

---

## Tecnologias

| Camada          | Tecnologia                            |
| --------------- | ------------------------------------- |
| Runtime         | Node.js 20+ (ESM nativo, sem nodemon) |
| Linguagem       | TypeScript 5 (strict mode)            |
| Framework       | Express.js + express-async-errors     |
| ORM             | Prisma 5                              |
| Banco de dados  | PostgreSQL (Docker)                   |
| Autenticação    | JWT (jsonwebtoken) + bcrypt           |
| Validação       | Zod                                   |
| Testes          | Jest + ts-jest + Supertest            |
| Containerização | Docker + Docker Compose               |

---

## Diagrama de Entidades

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email
        string password
        enum role
        datetime createdAt
        datetime updatedAt
    }
    Delivery {
        string id PK
        string userId FK
        string description
        enum status
        datetime createdAt
        datetime updatedAt
    }
    DeliveryLog {
        string id PK
        string deliveryId FK
        string description
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ Delivery : "possui"
    Delivery ||--o{ DeliveryLog : "registra"
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [Docker](https://www.docker.com/) e Docker Compose
- [npm](https://www.npmjs.com/)

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/logistics-hub.git
cd logistics-hub

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Suba o banco de dados
docker compose up -d

# 5. Execute as migrations
npx prisma migrate dev

# 6. Inicie o servidor
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/logistics-hub"
JWT_SECRET="sua_chave_secreta_aqui"
```

---

## Rotas da API

### Usuários

| Método | Rota     | Descrição              | Auth | Role |
| ------ | -------- | ---------------------- | :--: | ---- |
| `POST` | `/users` | Cadastrar novo usuário |  —   | —    |

### Sessões

| Método | Rota        | Descrição                    | Auth | Role |
| ------ | ----------- | ---------------------------- | :--: | ---- |
| `POST` | `/sessions` | Autenticar e obter token JWT |  —   | —    |

### Encomendas

| Método  | Rota                     | Descrição                     | Auth | Role   |
| ------- | ------------------------ | ----------------------------- | :--: | ------ |
| `POST`  | `/deliveries`            | Criar encomenda               |  ✓   | `sale` |
| `GET`   | `/deliveries`            | Listar todas as encomendas    |  ✓   | `sale` |
| `PATCH` | `/deliveries/:id/status` | Atualizar status da encomenda |  ✓   | `sale` |

### Logs de Rastreio

| Método | Rota                               | Descrição                        | Auth | Role               |
| ------ | ---------------------------------- | -------------------------------- | :--: | ------------------ |
| `POST` | `/delivery-logs`                   | Registrar log de movimentação    |  ✓   | `sale`             |
| `GET`  | `/delivery-logs/:delivery_id/show` | Consultar histórico da encomenda |  ✓   | `sale`, `customer` |

### Exemplo — Autenticação

```http
POST /sessions
Content-Type: application/json

{
  "email": "funcionario@empresa.com",
  "password": "senha123"
}
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Funcionário",
    "email": "funcionario@empresa.com"
  }
}
```

### Exemplo — Atualizar status

```http
PATCH /deliveries/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

---

## Testes

```bash
# Executar os testes uma vez
npx jest

# Executar em modo watch (re-executa a cada save)
npm run test:dev
```

Os testes de integração utilizam o banco de dados real e limpam os registros criados ao final de cada suíte via `afterAll` com `delete` por ID.

**Cobertura atual:**

| Suíte                | Cenários testados                                              |
| -------------------- | -------------------------------------------------------------- |
| `UsersController`    | Criação com sucesso · E-mail duplicado · E-mail inválido (Zod) |
| `SessionsController` | Autenticação com sucesso e retorno do token                    |

---

## Estrutura do projeto

```
logistics-hub/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── configs/
│   │   └── auth.ts
│   ├── controllers/
│   │   ├── deliveries-controller.ts
│   │   ├── deliveries-status-controller.ts
│   │   ├── delivery-logs-controller.ts
│   │   ├── sessions-controller.ts
│   │   └── user-controller.ts
│   ├── database/
│   │   └── prisma.ts
│   ├── middlewares/
│   │   ├── ensune-authenticated.ts
│   │   ├── error-handling.ts
│   │   └── verify-user-authorization.ts
│   ├── routes/
│   │   ├── deliveries-routes.ts
│   │   ├── delivery-logs-routes.ts
│   │   ├── index.ts
│   │   ├── sessions-routes.ts
│   │   └── users-routes.ts
│   ├── tests/
│   │   ├── sessions-controller.test.ts
│   │   └── users-controller.test.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── utils/
│   │   └── AppError.ts
│   ├── app.ts
│   ├── env.ts
│   └── server.ts
├── .env.example
├── docker-compose.yml
├── jest.config.ts
├── package.json
└── tsconfig.json
```

---

## Autor

Feito por **Horácio Júnior** — [LinkedIn](https://www.linkedin.com/in/j%C3%BAnior-almeida-3563a934b/) · [GitHub](https://github.com/juninalmeida)

- ✉️ [Email](mailto:junioralmeidati2023@gmail.com)
