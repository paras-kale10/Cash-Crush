# CashCrush Deployment Guide

## Architecture

```
┌─────────────┐     HTTPS      ┌──────────────┐     SSL      ┌─────────────┐
│   Vercel    │ ──────────────▶│  API Host    │ ────────────▶│    Neon     │
│  (React)    │   JWT + REST   │ Railway/     │  Prisma    │ PostgreSQL  │
│             │                │ Render/Fly   │            │             │
└─────────────┘                └──────────────┘            └─────────────┘
```

---

## 1. Deploy Database (Neon)

1. Create production database on [neon.tech](https://neon.tech)
2. Copy connection string with `?sslmode=require`
3. Run migrations against production:

```bash
cd backend
DATABASE_URL="postgresql://..." npm run db:migrate
DATABASE_URL="postgresql://..." npm run db:seed
```

---

## 2. Deploy Backend API

Recommended hosts: **Railway**, **Render**, or **Fly.io**

### Railway Example

1. Connect GitHub repo
2. Set root directory: `backend`
3. Build command: `npm install && npm run db:generate`
4. Start command: `npm run db:migrate && npm start`
5. Environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=<64-char-random>
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
PORT=3001
```

6. Note your API URL: `https://cashcrush-api.up.railway.app`

---

## 3. Deploy Frontend (Vercel)

1. Import repo on [vercel.com](https://vercel.com)
2. Framework: **Vite**
3. Root directory: `.` (project root)
4. Build: `npm run build`
5. Output: `dist`
6. Environment variables:

```env
VITE_USE_API=true
VITE_API_URL=https://cashcrush-api.up.railway.app/api
```

7. Deploy

### vercel.json (optional CORS helper — API handles CORS)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 4. Post-Deploy Checklist

- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] Register new user works
- [ ] Login returns JWT
- [ ] CORS allows your Vercel domain in `CLIENT_URL`
- [ ] Neon connection uses SSL
- [ ] JWT_SECRET is unique and not committed to git
- [ ] Rate limiting active on auth routes
- [ ] Existing users: login triggers localStorage migration

---

## 5. Environment Matrix

| Variable | Backend | Frontend |
|----------|---------|----------|
| `DATABASE_URL` | ✅ Neon connection | — |
| `JWT_SECRET` | ✅ Random secret | — |
| `CLIENT_URL` | ✅ Vercel URL | — |
| `VITE_USE_API` | — | ✅ `true` |
| `VITE_API_URL` | — | ✅ API base URL |

---

## 6. Google Auth (Future)

Schema already includes `googleId` on User:

```prisma
googleId String? @unique
```

To add later:
1. Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
2. Add `POST /api/auth/google` route
3. Verify Google ID token, upsert user by `googleId`
4. Issue JWT same as email login

---

## 7. Local Development

Terminal 1 — API:
```bash
cd backend && npm run dev
```

Terminal 2 — Frontend:
```bash
# .env: VITE_USE_API=true, VITE_API_URL=/api
npm run dev
```

Vite proxies `/api` → `http://localhost:3001`

---

## 8. Rollback Strategy

- Keep `VITE_USE_API=false` to revert to localStorage-only mode
- Legacy `cashcrush_data` key preserved until migration succeeds
- `migratedFromLocal` flag prevents duplicate imports
