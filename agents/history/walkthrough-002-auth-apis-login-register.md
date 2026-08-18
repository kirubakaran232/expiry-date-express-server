# Walkthrough 002 — Implementing Auth APIs: Login & Register

**Date**: 2026-08-13  
**Task Title**: Implementing Auth APIs - Login & Register  
**Status**: ✅ Completed

---

## Overview

Implemented `POST /auth/register` and `POST /auth/login` REST APIs following the strict **Controller → Service → DAO** pattern. Added a `User` MongoDB collection, Swagger documentation, and wired everything into `server.js`.

---

## New Files Created

| File | Layer | Purpose |
|---|---|---|
| `src/config/db.js` | Config | Mongoose connection helper |
| `src/config/swagger.js` | Config | OpenAPI 3.0 spec config (swagger-jsdoc) |
| `src/models/userModel.js` | Model | User Mongoose schema |
| `src/dao/userDao.js` | DAO | `findByEmail`, `createUser` DB operations |
| `src/services/authService.js` | Service | Register/login business logic |
| `src/controllers/authController.js` | Controller | HTTP handlers + Swagger JSDoc annotations |
| `src/routes/authRoutes.js` | Route | Maps endpoints to controller |

---

## Modified Files

| File | Change |
|---|---|
| `server.js` | Added DB connection, Swagger UI at `/api-docs`, mounted `/auth` routes |
| `package.json` | Added `swagger-jsdoc` and `swagger-ui-express` dependencies |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT cookie |
| `GET` | `/api-docs` | Swagger UI documentation |

---

## User Collection Schema

```js
{
  name:      String  // required, trimmed
  email:     String  // required, unique, lowercase
  password:  String  // required, bcrypt hashed (never returned in responses)
  createdAt: Date    // auto (timestamps: true)
  updatedAt: Date    // auto (timestamps: true)
}
```

---

## Architecture Pattern followed

```
POST /auth/register
  └─ authRoutes.js        (route + express-validator rules)
      └─ authController.js (validate → delegate)
          └─ authService.js (hash password, check duplicate)
              └─ userDao.js  (Mongoose: createUser)
                  └─ userModel.js (Schema)
```

---

## Swagger Documentation

- Spec generated from JSDoc annotations in `authController.js`
- Served at `GET /api-docs` via `swagger-ui-express`
- Schemas defined: `RegisterRequest`, `LoginRequest`, `UserResponse`, `ErrorResponse`
- Cookie-based auth scheme (`jwtToken`) registered in components

---

## New Dependencies

| Package | Version | Purpose |
|---|---|---|
| `swagger-jsdoc` | ^6.2.8 | Generate OpenAPI spec from JSDoc |
| `swagger-ui-express` | ^5.0.1 | Serve Swagger UI |

---

## Setup Notes

Run in terminal after pulling changes:
```bash
npm install
```

Make sure `.env` has:
```
MONGO_URI=mongodb://localhost:27017/expiry-date-manager
JWT_SECRET=your_jwt_secret_here
```
