Classboard Monorepo (frontend + backend)
# Classboard (Monorepo)

A single repository containing **frontend** (Next.js) and **backend** (Fastify) apps for Classboard.

```
classboard/
  apps/
    backend/    # Fastify + TypeScript + MongoDB API
    frontend/   # Next.js 15 + React 19 UI
  README.md
```

---

## ✨ Features

* Secure auth with JWT (stored as **httpOnly cookie** by the frontend)
* Users: filters, search, pagination, CRUD, bulk disable
* Metrics: summary cards + signups chart (UTC day buckets)
* Global search suggestions
* Strong server‑side role checks (`admin` / `teacher` / `student`)

---

## 🛠 Prerequisites

* **Node.js 20+**
* **MongoDB** running locally (`mongodb://localhost:27017`)

> Backend runs on `http://localhost:4000`, frontend on `http://localhost:3000` by default.

---

## 🚀 Quick Start

### 1) Clone

```bash
# HTTPS
git clone https://github.com/<you>/classboard.git
# or SSH
git clone git@github.com:<you>/classboard.git
cd classboard
```

### 2) Environment files

Create these files (copy the examples below):

**apps/backend/.env**

```env
MONGO_URL=mongodb://localhost:27017/classboard
JWT_SECRET=change-me-to-a-long-random-string
PORT=4000
CORS_ORIGIN=http://localhost:3000
BCRYPT_SALT_ROUNDS=10
```

**apps/frontend/.env.local**

```env
BACKEND_URL=http://localhost:4000
SESSION_COOKIE_NAME=classboard_session
NEXT_PUBLIC_USE_MOCK=false
```

### 3) Install dependencies

```bash
# backend
yarn --cwd apps/backend || npm --prefix apps/backend i
# frontend
yarn --cwd apps/frontend || npm --prefix apps/frontend i

# If you see peer-dep conflicts on the frontend:
npm config set legacy-peer-deps true
npm --prefix apps/frontend i
npm --prefix apps/frontend i react-is
```

### 4) Seed admin (optional)

```bash
npm --prefix apps/backend run seed
```

Credentials:

* **Email:** `admin@classboard.local`
* **Password:** `Admin@123`

### 5) Run apps

```bash
# terminal A
npm --prefix apps/backend run dev

# terminal B
npm --prefix apps/frontend run dev
```

Open **[http://localhost:3000](http://localhost:3000)** → login or sign up. Frontend proxies API calls and manages the cookie.

---

## 📁 Folder layout

```
apps/
  backend/
    src/
      models/      # User schema
      routes/      # /auth, /users, /metrics
      utils/       # authGuard, dates, password, etc.
      server.ts    # bootstrap
    package.json
    tsconfig.json

  frontend/
    app/           # Next.js app router
    components/    # UI components
    lib/           # api client, server proxy
    package.json
    next.config.ts
```

---

## 🔐 How auth works

1. **Login** (frontend → `/api/auth/login`) calls backend `/auth/login` and stores JWT in an **httpOnly cookie**.
2. **Protected pages** call `/api/auth/me` to fetch the current user (cookie is read server‑side).
3. UI hides admin controls for non‑admins, but **server still enforces roles**.

---

## 🧪 Useful API calls

**Login**

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@classboard.local","password":"Admin@123"}'
```

**List users (names start with "a")**

```bash
curl "http://localhost:4000/users?q=a&scope=name&mode=startsWith&role=all" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🧰 Scripts

Run inside each app directory:

**Backend**

* `npm run dev` – start Fastify with tsx (watch)
* `npm run build` – compile TypeScript to `dist/`
* `npm run start` – run compiled server
* `npm run seed` – create default admin

**Frontend**

* `npm run dev` – start Next.js dev server
* `npm run build` – production build
* `npm run start` – start production server

> Optional: at the repo root you can create a small `package.json` with a convenience script:
>
> ```json
> {
>   "private": true,
>   "devDependencies": { "concurrently": "^9" },
>   "scripts": {
>     "dev": "concurrently \"npm --prefix apps/backend run dev\" \"npm --prefix apps/frontend run dev\""
>   }
> }
> ```
>
> Then `npm i` at the root and run: `npm run dev` to launch both.

---

## 🩹 Troubleshooting

* **401 from /api/** (frontend): login first; the cookie must be set.
* **CORS error** (browser console): set `CORS_ORIGIN=http://localhost:3000` in backend `.env`.
* **Mongo connection error**: ensure `mongod` is running; check `MONGO_URL`.
* **Recharts error `react-is`**: run `npm i react-is` in **apps/frontend**.
* **Tooltip UI**: We hide the popup card globally but keep the hover line (see `components/ui/chart.tsx`, `ChartTooltip`).

---

## 🔒 Security Notes

* Use a long random `JWT_SECRET` in production.
* Restrict CORS and serve over HTTPS.
* All admin actions are checked on the backend; the UI is not a security boundary.



