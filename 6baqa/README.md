# 6baqa

Independent game studio portfolio — implemented from the Claude Design source
(`6baqa.dc.html`) as a **Vite** frontend + **NestJS** API monorepo.

```
.
├── api/                    NestJS API (serves the works catalogue)
│   └── src/
│       ├── main.ts         bootstrap: CORS + `/api` global prefix, port 3000
│       ├── app.module.ts
│       └── works/          works module (controller + service + type)
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

Node 20.19+ (or 22.12+). Dependencies install from the public npm registry
(pinned in this project's `.npmrc`).

## Install

```bash
npm install
```

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

| Method | Route              | Description                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/works`       | All works, in display order     |
| GET    | `/api/works/:slug` | A single work (404 if unknown)  |

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
