# 6baqa

Independent game studio portfolio — implemented from the Claude Design source
(`6baqa.dc.html`) as a **Vite** frontend + **NestJS** API monorepo.

```
.
├── api/                    NestJS API (serves the works catalogue)
│   ├── prisma/
│   │   ├── schema.prisma   Work model (Postgres, JSON content columns)
│   │   └── seed.ts         seeds the initial catalogue into the DB
│   ├── public/admin/       static admin panel (served at /admin)
│   └── src/
│       ├── main.ts         bootstrap: CORS, `/api` prefix, static admin + uploads
│       ├── prisma/         PrismaService (global module)
│       ├── works/          public works module (DB-backed + i18n)
│       ├── auth/           single-password login → JWT + guard
│       └── admin/          protected CRUD + image upload
├── web/                    Vite frontend (renders the design from the API)
│   ├── index.html          static shell (header / meta / footer)
│   ├── public/assets/      poster + hover-preview images
│   └── src/
│       ├── main.ts         fetches /api/works and renders the grid
│       └── style.css       the design, faithfully ported
├── standalone-reference.html   original single-file build (for reference)
└── package.json            npm workspaces + dev scripts
```

## Prerequisites

Node 20.19+ (or 22.12+) and a **PostgreSQL** database. Dependencies install
from the public npm registry (pinned in this project's `.npmrc`).

## Install

```bash
npm install
```

## Database & admin setup (first run)

The works catalogue lives in Postgres and is edited through the admin panel.
Copy the env template and fill it in:

```bash
cp apps/api/.env.example apps/api/.env
# set DATABASE_URL, JWT_SECRET, and an admin password
```

Generate a bcrypt hash for the admin password (preferred over plaintext):

```bash
npm run hash-password --workspace @6baqa/api -- 'your-password'
# put the output in ADMIN_PASSWORD_HASH
```

Create the tables and seed the two starter works:

```bash
npm run db:push --workspace @6baqa/api    # sync schema → database
npm run db:seed --workspace @6baqa/api    # load 99node + qurbaqa
```

Then the admin panel is at **http://localhost:3000/admin** — sign in with your
password to create/edit/delete works, reorder them, and upload images.

## Develop

Runs the API (`http://localhost:3000`) and the Vite dev server
(`http://localhost:5173`) together. Vite proxies `/api` → the NestJS server,
so the browser only ever talks to the Vite origin.

```bash
npm run dev
```

Then open http://localhost:5173.

Run either side on its own:

```bash
npm run dev:api
npm run dev:web
```

## API

Public (read-only):

| Method | Route              | Description                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/works`       | All works, in display order     |
| GET    | `/api/works/:slug` | A single work (404 if unknown)  |

Admin (require `Authorization: Bearer <token>` from `/api/auth/login`):

| Method | Route                       | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/api/auth/login`           | `{ password }` → `{ token }`   |
| GET    | `/api/admin/works`          | All works, full raw fields     |
| POST   | `/api/admin/works`          | Create a work                  |
| PUT    | `/api/admin/works/:id`      | Update a work                  |
| PUT    | `/api/admin/works/reorder`  | `{ ids: [...] }` → set order   |
| DELETE | `/api/admin/works/:id`      | Delete a work                  |
| POST   | `/api/admin/upload`         | multipart `file` → `{ url }`   |

## Environment variables (API)

| Variable              | Required | Notes                                            |
| --------------------- | -------- | ------------------------------------------------ |
| `DATABASE_URL`        | yes      | Postgres connection string                       |
| `JWT_SECRET`          | yes      | signs admin JWTs — long random string in prod    |
| `ADMIN_PASSWORD_HASH` | yes\*    | bcrypt hash of the admin password (preferred)    |
| `ADMIN_PASSWORD`      | yes\*    | plaintext fallback if no hash is set             |
| `UPLOADS_DIR`         | no       | where uploads are written (use a volume in prod) |
| `PORT`                | no       | defaults to 3000 (Railway injects it)            |

\* set exactly one of `ADMIN_PASSWORD_HASH` / `ADMIN_PASSWORD`.

On **Railway**, set these on the API service and mount a volume for `UPLOADS_DIR`
so uploaded images survive redeploys. The API container runs `prisma db push`
on start, so tables are created/synced automatically; run the seed once
(`npm run db:seed`) against the production DB to load the initial works.

## Build

```bash
npm run build      # builds api → api/dist and web → web/dist
npm start          # serves the built API (node api/dist/main.js)
```

## Notes on the images

The `<image-slot>` frames in the original design are user-fillable placeholders,
and the source art exceeded Claude Design's 256 KiB file-read cap, so
`web/public/assets/` ships **generated atmospheric placeholders** (per-game mood
plus a brighter hover variant). Drop real screenshots in under the same
filenames — `<slug>.png` and `<slug>-hover.png` — to replace them; no code
changes needed.
