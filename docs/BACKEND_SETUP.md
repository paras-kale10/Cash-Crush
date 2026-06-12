# CashCrush Backend Setup

## Project Structure

```
CashCrush/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   ├── seed.js                # Achievement seed data
│   │   └── migrations/
│   │       └── 20250612000000_init/
│   │           └── migration.sql  # Initial SQL migration
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── app.js                 # Express app + middleware
│   │   ├── config/env.js
│   │   ├── lib/prisma.js
│   │   ├── middleware/            # auth, validate, errors
│   │   ├── validators/schemas.js  # Zod validation
│   │   ├── services/              # Business logic
│   │   ├── controllers/           # Route handlers
│   │   └── routes/                # API routes
│   ├── .env.example
│   └── package.json
├── src/
│   ├── api/                       # Frontend API client
│   └── utils/
│       ├── migrateLocalStorage.js # localStorage → PostgreSQL
│       └── hydrateFromApi.js      # API → Zustand store
└── docs/
```

## Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)

## 1. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → copy the **connection string**
3. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

## 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

Generate a JWT secret:

```bash
openssl rand -base64 64
```

## 3. Install & Migrate

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 4. Start API Server

```bash
npm run dev
```

API available at `http://localhost:3001/api`

Health check: `GET http://localhost:3001/api/health`

## 5. Enable Frontend API Mode

```bash
# In project root
cp .env.example .env
```

Set in root `.env`:

```env
VITE_USE_API=true
VITE_API_URL=/api
```

Start frontend (proxies `/api` → `localhost:3001`):

```bash
npm run dev
```

---

## API Reference

### Auth (public)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{ username, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

### User (JWT required)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/users/profile` | — |
| PATCH | `/api/users/profile` | `{ username?, avatar?, monthlyIncome?, salaryDate?, isOnboarded? }` |

### Transactions

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/transactions?type=EXPENSE&limit=100` | — |
| POST | `/api/transactions` | `{ type, name, amount, category?, date?, notes?, isPaid?, dueDate? }` |
| PATCH | `/api/transactions/:id` | partial update |
| DELETE | `/api/transactions/:id` | — |

**Types:** `EXPENSE` | `BILL` | `VAULT_DEPOSIT` | `INCOME`

### Goals

| Method | Endpoint |
|--------|----------|
| GET | `/api/goals` |
| POST | `/api/goals` |
| PATCH | `/api/goals/:id` |
| DELETE | `/api/goals/:id` |

### Vault

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/vault` | — |
| PATCH | `/api/vault` | `{ monthlyContribution?, currentSavings?, depositAmount? }` |

### Dashboard

| Method | Endpoint |
|--------|----------|
| GET | `/api/dashboard/stats` |

### Migration

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/migrate/local-storage` | `{ localData: { ...cashcrush_data } }` |

---

## Database Schema

### Users
- UUID primary key, email (unique), bcrypt password hash
- Profile: username, avatar, level, xp, title
- Finance: monthlyIncome, salaryDate, isOnboarded
- `googleId` nullable for future OAuth
- `migratedFromLocal` tracks localStorage migration

### Transactions
- Expenses, bills, vault deposits unified
- Indexed by `userId`, `type`, `date`

### Goals
- Savings goals with target/current amounts

### SecurityVault
- One per user (1:1)
- VaultHistory for deposit log

### Achievements + UserAchievements
- Seeded achievements, per-user unlocks

---

## localStorage Migration Flow

1. User updates app with `VITE_USE_API=true`
2. User logs in with same email as localStorage data
3. `migrateLegacyDataIfNeeded()` reads `cashcrush_data` from localStorage
4. POST `/api/migrate/local-storage` imports all data
5. Server sets `migratedFromLocal = true` (idempotent)
6. Frontend hydrates state from API

Migration only runs if:
- Email in localStorage matches logged-in user
- User has not already migrated
- Meaningful local data exists

---

## Security Best Practices

- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** in `Authorization: Bearer` header
- **Helmet** security headers
- **Rate limiting** on auth routes (20/15min)
- **Zod** input validation on all endpoints
- **CORS** restricted to `CLIENT_URL`
- Never store passwords in frontend state when API mode is on
- Use strong `JWT_SECRET` in production
- Neon requires `?sslmode=require`

---

## Frontend Integration Example

```js
import { authApi } from './api/services.js';
import { setToken } from './api/client.js';
import { fetchFullUserState } from './utils/hydrateFromApi.js';

// Login
const { token } = await authApi.login({ email, password });
setToken(token);
const state = await fetchFullUserState();

// Add expense
import { transactionApi } from './api/services.js';
await transactionApi.create({
  type: 'EXPENSE',
  name: 'Coffee',
  amount: 150,
  category: 'Food',
});
```
