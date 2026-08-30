# Ledgerio API

A RESTful API built with Node.js, Express, TypeScript, and Prisma for user authentication and management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [Security Features](#security-features)

## Features

- User authentication with JWT (Access & Refresh tokens)
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

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit
- **Dev Tools**: nodemon, ts-node

## Project Structure

```
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

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ledgerio/api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Run database migrations:
```bash
npm run db:migrate
```

5. Generate Prisma Client:
```bash
npm run db:generate
```

6. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`

## Environment Variables

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

## API Endpoints

### Base URL
```
http://localhost:5001/v1
```

### Health Check
- **GET** `/` - Check API status

### Authentication Routes (`/auth`)

#### Sign Up
- **POST** `/auth/sign-up`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "username",
    "password": "password123"
  }
  ```

#### Sign In
- **POST** `/auth/sign-in`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Refresh Token
- **POST** `/auth/refresh-token`
- **Cookie**: `refreshToken` (JWT)

#### Logout
- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer <access_token>`

### User Routes (`/user`)

All user routes require authentication via JWT token in Authorization header.

#### Get Current User
- **GET** `/user/current`
- **Headers**: `Authorization: Bearer <access_token>`

#### Update Current User
- **PUT** `/user/current`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body** (all fields optional):
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

#### Get User By ID
- **GET** `/user/:userId`
- **Headers**: `Authorization: Bearer <access_token>`
- **Params**: `userId` (CUID format: 25 characters starting with 'c')

#### Delete User By ID
- **DELETE** `/user/:userId`
- **Headers**: `Authorization: Bearer <access_token>`
- **Params**: `userId` (CUID format)

## Database Schema

### User Model
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

### Token Model
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

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Database Management

#### Create a new migration
```bash
npm run db:migrate
```

#### View database in Prisma Studio
```bash
npm run db:studio
```

## Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Refresh tokens stored in HTTP-only cookies
- Password hashing using bcrypt

### Request Security
- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: All inputs validated using express-validator
- **Password Requirements**: Minimum 8 characters

### Data Protection
- Passwords never stored in plain text
- Password hashes excluded from API responses
- CUID validation for user IDs
- SQL injection protection via Prisma ORM

### Response Optimization
- Compression middleware for reduced payload size
- Response compression threshold: 1KB

### Logging
- Winston logger for comprehensive application logging
- Different log levels (info, warn, error)
- Structured logging for better debugging

## Error Handling

The API returns consistent error responses:

```json
{
  "code": "ErrorCode",
  "message": "Human-readable error message",
  "error": {} // Additional error details (development only)
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

## Validation Rules

### Email
- Required for registration and login
- Must be valid email format
- Maximum 50 characters
- Must be unique

### Password
- Minimum 8 characters
- Required for registration and login

### User Fields
- `name`: Maximum 20 characters
- `first_name`: Maximum 20 characters (optional)
- `last_name`: Maximum 20 characters (optional)
- `currency`: Maximum 3 characters (optional, auto-uppercased)
- `verify`: Boolean (optional)

### User ID
- Must be valid CUID format (25 characters, starts with 'c')
- Pattern: `^c[a-z0-9]{24}$`

## License

ISC

## Author

Ledgerio Team
