# Build context = repo root (needed for the npm workspace + lockfile).
# On Railway: Root Directory = repo root, Dockerfile Path = apps/api/Dockerfile
FROM node:22-alpine AS build
WORKDIR /app

# Copy only manifests first for better layer caching.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

# Build the API workspace.
COPY apps/api apps/api
RUN npm run build --workspace @6baqa/api

# --- Runtime image: prod deps only ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist apps/api/dist

WORKDIR /app/apps/api
# Railway injects PORT; main.ts reads process.env.PORT (falls back to 3000).
EXPOSE 3000
CMD ["node", "dist/main.js"]
