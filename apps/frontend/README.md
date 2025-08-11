# Classboard

A polished, login‑protected analytics dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. It ships with a “Mock Mode” (in‑memory data) for instant local development and a clear path to enable a real backend (“Backend Mode”) without changing the UI.

Highlights
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui (including the new Sidebar primitives)
- Recharts (via shadcn/ui chart helpers)
- react-hook-form + zod
- lucide-react icons
- Framer Motion
- next-themes (dark/system) with a global toggle

Run locally
1) Install deps: `pnpm i` (or `npm i` / `yarn`)
2) Dev: `pnpm dev`
3) Open http://localhost:3000

Mock accounts (Mock Mode)
- Admin: email admin@classboard.local / password admin123
- Viewer: email viewer@classboard.local / password viewer123

Keyboard shortcuts
- "/" focuses the global search
- "f" toggles the mobile filter drawer

Theming
- The Theme toggle in the header switches light/dark across the whole site (powered by next-themes).
- Dark and light variables are defined in app/globals.css and applied consistently.

Project structure
- app/(auth)/*: login and signup
- app/(protected)/*: authenticated dashboard routes (dashboard, users, profile, settings)
- app/landing-page: public landing page
- components/*: UI building blocks (Header, Sidebar, tables, dialogs, etc.)
- lib/*: utilities (auth, preferences, filters)
- types.ts: shared types

Data modes
- Mock Mode (default): Uses an in‑memory store for users, metrics, and auth to let you explore the UI immediately.
- Backend Mode (recommended for production): Replace the mock layer with Next.js API routes that call your backend and use httpOnly cookie sessions.

Switching from Mock Mode to Backend Mode (Checklist)
1) Remove fake data files
 - Delete lib/mock-api.ts
 - Delete lib/admin-whitelist.ts
 - Remove any imports from "@/lib/api" (or functions previously exported there).

2) Add server routes that proxy your backend
 - Create Next.js Route Handlers under:
   - app/api/auth/login/route.ts  (POST)
   - app/api/auth/logout/route.ts (POST)
   - app/api/auth/me/route.ts     (GET)
   - app/api/users/route.ts       (GET list, POST create)
   - app/api/users/[id]/route.ts  (PATCH update, DELETE remove)
   - app/api/metrics/summary/route.ts (GET)
   - app/api/metrics/signups/route.ts (GET)
 - In each handler, read the httpOnly cookie via cookies(), call your backend with Authorization: Bearer <session>, return JSON. Next.js Route Handlers support runtime APIs like cookies() and are ideal for secure proxying [^4][^5].

3) Switch to httpOnly cookie sessions
 - On login (POST /api/auth/login), set a secure httpOnly cookie (e.g., "session") from the server route.
 - On logout, delete the cookie.
 - On every authenticated API call, read the cookie via cookies() and forward to your backend.
 - This approach is recommended in the Next.js Authentication guide and supported in Route Handlers [^5][^4].

4) Add a small client API wrapper
 - Create lib/api.ts with helpers that call the app/api routes:
   - getUsers, createUser, updateUserById, deleteUserById
   - getSummary, getSignups
   - login, logout, getMe (and optionally updateMe)
 - Replace all imports from "@/lib/api" with "@/lib/api" in:
   - app/(protected)/dashboard/page.tsx
   - app/(protected)/users/page.tsx
   - app/(auth)/login/page.tsx
   - app/(auth)/signup/page.tsx
   - components/header.tsx (search suggestions use getUsers with limit=8)
   - components/user-dialog.tsx
   - components/add-user-dialog.tsx

5) Trust roles from your backend
 - Remove the client‑side whitelist (lib/admin-whitelist.ts). Admin roles should come from your user DB.
 - UI will continue to hide admin‑only controls when user.role !== "admin".
 - Server routes must enforce admin authorization to prevent forged requests.

6) Environment variables
 - BACKEND_URL: Your backend base URL (e.g., https://api.example.com).
   - In Vercel: Project Settings → Environment Variables.
   - Locally (standard Next.js): .env.local → BACKEND_URL="http://localhost:4000"
 - Do not expose secrets to the client. Route Handlers run on the server and can safely read env and cookies [^4][^5].

7) Data & formatting contracts
 - Users
   - createdAt: ISO string in UTC (the UI formats dates as yyyy/mm/dd)
 - Metrics
   - Summary:
     {
       "totalUsers": number,
       "totalTeachers": number,
       "totalStudents": number,
       "weeklySignups": number,
       "deltas": {
         "users": number,
         "teachers": number,
         "students": number,
         "weeklySignups": number
       }
     }
   - Signups:
     Array<{ "date": "yyyy/mm/dd", "count": number }>
     Group by UTC day so the chart matches the table’s “Joined” date formatting.

API contract (frontend → Next API → backend)
- Auth
- POST /api/auth/login
  body: { email, password }
  effect: sets httpOnly session cookie, returns 200 or 401
- POST /api/auth/logout
  effect: deletes session cookie
- GET /api/auth/me
  returns current user
- Users
- GET /api/users
  query: q, page, limit, role, start, end, sort (e.g., createdAt:desc)
  returns: { data: User[], page: number, total: number }
- POST /api/users (admin only)
  body: { name, email, role, bio?, createdAt? }
  returns: created user
- PATCH /api/users/:id (admin only)
  body: partial { name, role, bio, disabled }
  returns: updated user
- DELETE /api/users/:id (admin only)
  effect: removes user
- Metrics
- GET /api/metrics/summary
  query: role?, q?, start?, end?
  returns: Summary (see shape above)
- GET /api/metrics/signups
  query: role?, q?, start?, end?
  returns: Array<{ date: "yyyy/mm/dd", count: number }>

Security notes
- Enforce authorization in Route Handlers (server) — do NOT trust client role flags.
- Use httpOnly cookies for sessions. Avoid storing tokens in localStorage for authenticated requests [^5].
- Route Handlers can safely read cookies() and call your backend with Authorization headers [^4].

Accessibility
- Semantic structure for header/main
- ARIA attributes on search listbox and controls
- Keyboard navigation for suggestions and focus shortcuts
- Respects prefers-reduced-motion globally

Sidebar
- The app uses the new shadcn/ui Sidebar primitives (collapsible "icon" mode, provider/trigger, groups/menus). See shadcn/ui docs for composition patterns if you want to extend it further [^6].

Troubleshooting
- Search suggestions don’t appear:
- Ensure /api/users returns results for q with limit=8 and no unnecessary date filters.
- Graph doesn’t match table:
- Verify your backend groups signups by UTC day and returns date as yyyy/mm/dd.
- Admin actions fail:
- Confirm your server-side admin checks in the Route Handlers and backend.
- Ensure the session cookie is present and your backend accepts it via Authorization: Bearer.

Roadmap ideas
- Server render the current user for faster initial paint
- Add rate limiting to API routes
- Add audit logs for admin actions
- Add e2e tests (Playwright) for auth, users CRUD, and charts

Citations
- Route Handlers and runtime APIs (cookies) in Next.js 15.1 [^4]
- Next.js Authentication guide: sessions and cookies [^5]
- shadcn/ui Sidebar composition [^6]
