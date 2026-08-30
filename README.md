<div align="center">

# Ledgerio API

A RESTful API for time tracking and invoicing, built with Node.js, Express, TypeScript, and Prisma.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🧭 Architecture](#-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🔐 Authentication Flow](#-authentication-flow)
- [🗄️ Database Schema](#️-database-schema)
- [🛠️ Development](#️-development)
- [🛡️ Security Features](#️-security-features)
- [⚠️ Error Handling](#️-error-handling)
- [✅ Validation Rules](#-validation-rules)
- [📄 License](#-license)

---

## ✨ Features

- User authentication with JWT (access & refresh tokens)
- User registration and login
- User profile management
- Secure password hashing with bcrypt
- Token-based authentication
- Input validation with express-validator
- Database operations with Prisma ORM
- PostgreSQL database
- Rate limiting
- CORS protection
- Helmet security headers
- Response compression
- Comprehensive logging with Winston
- TypeScript for type safety

## 🧰 Tech Stack

| Category         | Technology                          |
| ----------------- | ------------------------------------ |
| Runtime           | Node.js                              |
| Framework         | Express.js v5                        |
| Language          | TypeScript                           |
| Database          | PostgreSQL                           |
| ORM               | Prisma                               |
| Authentication    | JWT (`jsonwebtoken`)                 |
| Password hashing  | bcrypt                               |
| Validation        | express-validator                    |
| Logging           | Winston                              |
| Security          | Helmet, CORS, express-rate-limit     |
| Dev tools         | nodemon, ts-node                     |

## 🧭 Architecture

```mermaid
flowchart LR
    Client(["🖥️ Client"]) -->|HTTP / JSON| API["🚂 Express API"]
    API -->|reads / writes| Prisma[("🔺 Prisma Client")]
    Prisma --> DB[("🐘 PostgreSQL")]
    API -->|signs & verifies| JWT["🔑 JWT Access / Refresh Tokens"]
    JWT -.->|refresh token stored in| DB
```

## 🗂️ Project Structure

```text
src/
├── @types/           # TypeScript type definitions
├── config/           # Application configuration
├── controllers/      # Request handlers
│   └── v1/
│       ├── auth/     # Authentication controllers
│       └── user/     # User management controllers
├── db/               # Database connection
├── generated/        # Prisma generated files
├── lib/              # Utility libraries
│   ├── jwt/          # JWT utilities
│   ├── winston/      # Logger configuration
│   └── expres-rate-limit/
├── middlewares/      # Express middlewares
│   ├── authenticate/ # JWT authentication middleware
│   ├── verify/       # User verification middleware
│   └── validation-error/
├── routes/           # API routes
│   └── v1/           # Version 1 routes
├── app.ts            # Application entry point
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd ledgerio/api
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

**4. Run database migrations**

```bash
npm run db:migrate
```

**5. Generate Prisma Client**

```bash
npm run db:generate
```

**6. Start the development server**

```bash
npm run dev
```

The API will be available at `http://localhost:5001`.

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5001
APP_NAME=ledgerio-api-v0
NODE_ENV=development

# Database
PSQL_DB_URL=postgresql://user:password@localhost:5432/ledgerio

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Token Expiration
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Logging
LOG_LEVEL=info
```

## 📡 API Endpoints

Base URL: `http://localhost:5001/v1`

| Method   | Endpoint              | Auth required | Description                |
| -------- | ---------------------- | :------------: | --------------------------- |
| `GET`    | `/`                    | –              | Health check                |
| `POST`   | `/auth/sign-up`        | –              | Register a new user         |
| `POST`   | `/auth/sign-in`        | –              | Log in                      |
| `POST`   | `/auth/refresh-token`  | Cookie         | Issue a new access token    |
| `POST`   | `/auth/logout`         | ✅             | Log out, revoke refresh token |
| `GET`    | `/user/current`        | ✅             | Get the current user's profile |
| `PUT`    | `/user/current`        | ✅             | Update the current user's profile |
| `GET`    | `/user/:userId`        | ✅             | Get a user by ID            |
| `DELETE` | `/user/:userId`        | ✅             | Delete a user by ID         |

### Authentication routes (`/auth`)

<details>
<summary><strong>POST /auth/sign-up</strong></summary>

```json
{
  "email": "user@example.com",
  "name": "username",
  "password": "password123"
}
```

</details>

<details>
<summary><strong>POST /auth/sign-in</strong></summary>

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

</details>

<details>
<summary><strong>POST /auth/refresh-token</strong></summary>

Reads the `refreshToken` cookie (HTTP-only) and returns a new access token.

</details>

<details>
<summary><strong>POST /auth/logout</strong></summary>

Requires `Authorization: Bearer <access_token>`. Revokes the refresh token and clears the cookie.

</details>

### User routes (`/user`)

All user routes require `Authorization: Bearer <access_token>`.

<details>
<summary><strong>GET /user/current</strong> — get the current user's profile</summary>

No body.

</details>

<details>
<summary><strong>PUT /user/current</strong> — update the current user's profile (all fields optional)</summary>

```json
{
  "email": "newemail@example.com",
  "name": "newusername",
  "first_name": "John",
  "last_name": "Doe",
  "currency": "USD",
  "verify": true
}
```

</details>

<details>
<summary><strong>GET /user/:userId</strong> — get a user by ID</summary>

`userId` must be a valid CUID (25 characters, starts with `c`).

</details>

<details>
<summary><strong>DELETE /user/:userId</strong> — delete a user by ID</summary>

`userId` must be a valid CUID (25 characters, starts with `c`).

</details>

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant C as 🖥️ Client
    participant A as 🚂 API
    participant DB as 🐘 PostgreSQL

    C->>A: POST /auth/sign-up (email, name, password)
    A->>A: hash password (bcrypt)
    A->>DB: create User
    A->>DB: create Token (refresh token)
    A-->>C: 200 + accessToken + refreshToken cookie

    C->>A: GET /user/current (Bearer accessToken)
    A-->>C: 200 + user profile

    C->>A: POST /auth/refresh-token (cookie)
    A->>DB: check refresh token exists
    A-->>C: 200 + new accessToken

    C->>A: POST /auth/logout (Bearer accessToken)
    A->>DB: delete Token
    A-->>C: 204 + cookie cleared
```

## 🗄️ Database Schema

### User

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  firstName    String   @default("")
  lastName     String   @default("")
  currency     String   @default("USD")
  verify       Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  token        Token[]
}
```

### Token

```prisma
model Token {
  id        String   @id @default(cuid())
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🛠️ Development

### Available scripts

| Script               | Description                              |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Start the dev server with hot reload     |
| `npm run db:migrate`  | Run database migrations                  |
| `npm run db:generate` | Generate the Prisma Client               |
| `npm run db:studio`   | Open Prisma Studio (database GUI)        |

## 🛡️ Security Features

**🔑 Authentication**
- JWT-based authentication with access and refresh tokens
- Refresh tokens stored in HTTP-only cookies
- Password hashing using bcrypt

**🌐 Request security**
- Helmet — sets security-related HTTP headers
- CORS — configurable cross-origin resource sharing
- Rate limiting — mitigates abuse and brute-force/DDoS attempts
- Input validation — every input validated with express-validator
- Password requirements — minimum 8 characters

**🔒 Data protection**
- Passwords never stored in plain text
- Password hashes excluded from API responses
- CUID validation for user IDs
- SQL injection protection via Prisma ORM

**⚡ Response optimization**
- Compression middleware for smaller payloads (threshold: 1KB)

**📝 Logging**
- Winston logger with structured, leveled logging (info/warn/error)

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "code": "ErrorCode",
  "message": "Human-readable error message",
  "error": {}
}
```

`error` is only populated in development.

| Status | Meaning                              |
| ------ | -------------------------------------- |
| `200`  | Success                                |
| `201`  | Created                                |
| `204`  | No Content (successful deletion)       |
| `400`  | Bad Request (validation errors)        |
| `401`  | Unauthorized (authentication required) |
| `404`  | Not Found                              |
| `500`  | Internal Server Error                  |

## ✅ Validation Rules

| Field             | Rules                                                             |
| ------------------ | ------------------------------------------------------------------ |
| `email`           | required (sign-up/sign-in), valid format, max 50 chars, unique   |
| `password`        | required, min 8 characters                                       |
| `name`            | max 20 characters                                                 |
| `first_name`      | optional, max 20 characters                                      |
| `last_name`       | optional, max 20 characters                                      |
| `currency`        | optional, max 3 characters, auto-uppercased                      |
| `verify`          | optional, boolean                                                 |
| `userId` (param)  | valid CUID — 25 characters, starts with `c`, pattern `^c[a-z0-9]{24}$` |

## 📄 License

ISC

## Author

**Oleksandr Lobanov**

[![Telegram](https://img.shields.io/badge/Telegram-@alexalexdev-26A5E4?logo=telegram&logoColor=white)](https://t.me/alexalexdev)
[![Instagram](https://img.shields.io/badge/Instagram-alex.alex.lobanov-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/alex.alex.lobanov/)
