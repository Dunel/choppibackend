<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
API backend de Choppi construida con NestJS, TypeScript, TypeORM y PostgreSQL. Proporciona autenticación basada en JWT, operaciones CRUD para tiendas y productos, gestión de inventario y precios por tienda (store-products), validación global de peticiones y documentación Swagger (OpenAPI).

## Contents
Overview
Technology Stack
Environment Variables
Installation & Running
Database / Migrations / Seeds
Domain Model
Authentication
Pagination & Query Conventions
Endpoints Summary
Detailed Endpoint Reference
Error Responses
Swagger Documentation
Development Scripts
Deployment Notes (Railway)
License

## Overview
The API manages:
- Users (registration, login, profile)
- Stores (owned by a user, soft deletion)
- Products (global catalog)
- StoreProducts (price and stock per store/product pair)

## Technology Stack
- NestJS 11
- TypeScript
- TypeORM 0.3.x
- PostgreSQL
- JWT (passport-local + passport-jwt)
- Class-Validator / Class-Transformer
- Swagger via @nestjs/swagger

## Environment Variables
File: `.env` (examples)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=changeme
DB_NAME=postgres
DB_SYNC=false
DB_SSL=false
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600
PORT=3000
```

## Installation & Running
```bash
npm install
npm run start:dev   # development with watch
npm run build       # compile to dist
npm run start:prod  # run compiled code
```

## Database / Migrations / Seeds
Runtime config: `src/config/typeorm.config.ts`. CLI datasource: `src/datasource.ts`.
```bash
npm run migration:generate   # generate migration from entities (adjust script name as needed)
npm run migration:run        # apply pending migrations
npm run migration:revert     # revert last migration
```
Seed migration inserts demo user (`test@gmail.com` / `demo123`), sample stores, products, store_products rows.

## Domain Model
Entity | Fields
------ | ------------------------------------------------------------------------------
User | id (uuid), email (unique), password (hashed), created_at
Store | id (uuid), name, address (nullable), owner (User), created_at, deleted_at (soft)
Product | id (uuid), name, description (nullable), created_at
StoreProduct | id (uuid), store (Store), product (Product), price (decimal), stock (int)

## Authentication
POST /auth/register → access token + sanitized user.
POST /auth/login → access token + sanitized user.
GET /auth/profile → current authenticated user.
Header for protected routes: `Authorization: Bearer <token>`.

## Pagination & Query Conventions
- `page` (default 1), `limit` (default 10)
- `q` (search) for stores (name/address) and store-products (product name/description)
- `inStock=true` returns store-products with `stock > 0`

## Endpoints Summary
Auth
- POST /auth/register
- POST /auth/login
- GET /auth/profile (protected)

Stores
- GET /stores (?page, ?limit, ?q)
- GET /stores/:id
- POST /stores (protected)
- PUT /stores/:id (protected)
- DELETE /stores/:id (protected, soft delete)

Products
- GET /products/:id
- POST /products (protected)

Store Products
- POST /stores/:storeId/products (protected)
- GET /stores/:storeId/products (?page, ?limit, ?q, ?inStock)
- PUT /stores/:storeId/products/:storeProductId (protected)
- DELETE /stores/:storeId/products/:storeProductId (protected)

## Detailed Endpoint Reference
### Auth
POST /auth/register
Body: `{ "email": string, "password": string, "displayName"?: string }`
Response: `{ accessToken: string, user: { id, email } }`

POST /auth/login
Body: `{ "email": string, "password": string }`
Response: same as register.

GET /auth/profile (protected)
Header: `Authorization: Bearer <token>`
Response: `{ userId, email }`

### Stores
GET /stores
Query: `page`, `limit`, `q`
Response: `{ data: Store[], meta: { page, limit, total } }`

GET /stores/:id → Store or 404.

POST /stores (protected)
Body: `{ "name": string, "address"?: string }`
Response: Store.

PUT /stores/:id (protected)
Body: partial of CreateStoreDto.
Response: updated Store.

DELETE /stores/:id (protected)
Soft deletes store. Response: `{ success: true }`

### Products
GET /products/:id → Product or 404.

POST /products (protected)
Body: `{ "name": string, "description"?: string }`
Response: Product.

### Store Products
POST /stores/:storeId/products (protected)
Body: `{ "productId": uuid, "price": number, "stock": number }`
Response: StoreProduct.

GET /stores/:storeId/products
Query: `page`, `limit`, `q`, `inStock`
Response: `{ data: StoreProduct[], meta: { page, limit, total } }` (joined Product info).

PUT /stores/:storeId/products/:storeProductId (protected)
Body: `{ "price"?: number, "stock"?: number }`
Response: updated StoreProduct.

DELETE /stores/:storeId/products/:storeProductId (protected)
Response: empty (204) or `{}`.

## Error Responses
Examples:
400 Validation → `{ "statusCode": 400, "message": ["error"], "error": "Bad Request" }`
401 Unauthorized → `{ "statusCode": 401, "message": "Unauthorized" }`
404 Not found → `{ "statusCode": 404, "message": "Store not found", "error": "Not Found" }`

## Swagger Documentation
Path: `/api`.
Use Authorize with `Bearer <token>` to access protected endpoints.
DTO models include examples.

## Development Scripts
```bash
npm run start        # dev
npm run start:dev    # dev watch
npm run build        # compile
npm run start:prod   # production
npm run lint         # eslint
npm run test         # unit tests
npm run test:e2e     # e2e tests
npm run migration:run
npm run migration:revert
```

## Deployment Notes (Railway)
1. Create Railway service from repository.
2. Set env vars (DB_*, JWT_*, PORT).
3. Provide Postgres (managed service or external).
4. Deploy with command `npm run start:prod`.
5. Public domain shows under service Domains; Swagger at `<public-url>/api`.

## License
UNLICENSED (internal project). Adjust if needed.
