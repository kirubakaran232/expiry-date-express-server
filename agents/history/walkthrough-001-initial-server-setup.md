# Walkthrough 001 — Initial Server Setup

**Date**: 2026-08-13  
**Status**: ✅ Completed & Verified by User

---

## Overview

Set up the bare-minimum Express.js server for the Expiry Date Manager backend, including the full `src/` folder structure as defined in `agents/skills/instructions.md`.

---

## Changes Made

### New Files Created

| File | Description |
|---|---|
| `server.js` | Express entry point — listens on port `5001` |
| `package.json` | Project manifest with all dependencies |
| `.env.example` | Environment variable template |
| `.gitignore` | Excludes `node_modules/`, `.env`, `*.log` |
| `src/config/` | Config directory (placeholder) |
| `src/controllers/` | Controllers directory (placeholder) |
| `src/services/` | Services directory (placeholder) |
| `src/routes/` | Routes directory (placeholder) |
| `src/models/` | Models directory (placeholder) |
| `src/dao/` | DAO directory (placeholder) |
| `src/utils/` | Utils directory (placeholder) |

---

## Dependencies Installed

### Production
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `dotenv` | Environment variable loader |
| `cors` | Cross-origin resource sharing |
| `cookie-parser` | Parse cookies (used for JWT) |
| `express-validator` | Request input validation |
| `jsonwebtoken` | JWT signing & verification |
| `bcryptjs` | Password hashing |

### Dev
| Package | Purpose |
|---|---|
| `nodemon` | Auto-restart on file changes |

---

## server.js Highlights

- Loads `dotenv` at startup
- Registers `express.json()`, `express.urlencoded()`, `cookie-parser`, `cors` middleware
- CORS configured for `CLIENT_ORIGIN` (default: `http://localhost:5173`)
- `GET /health` endpoint returns `{ status: 'ok' }`
- Listens on `process.env.PORT || 5001`

---

## Environment Variables (`.env.example`)

```
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/expiry-date-manager
JWT_SECRET=your_jwt_secret_here
```

---

## Verification

- User confirmed server starts successfully on port `5001`
- User confirmed happy with the results ✅
