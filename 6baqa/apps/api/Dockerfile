# Build context = repo root (needed for the npm workspace + lockfile).
# On Railway: Root Directory = repo root, Dockerfile Path = apps/api/Dockerfile
FROM node:22-alpine AS build
WORKDIR /app

# Copy only manifests first for better layer caching.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

# Build the API workspace (build script runs `prisma generate` then `nest build`).
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

# Prisma schema + generated client are needed at runtime (db push + queries).
COPY apps/api/prisma apps/api/prisma
RUN npx --workspace @6baqa/api prisma generate --schema apps/api/prisma/schema.prisma

# Built server + static admin UI.
COPY --from=build /app/apps/api/dist apps/api/dist
COPY apps/api/public apps/api/public

WORKDIR /app/apps/api
# Railway injects PORT; main.ts reads process.env.PORT (falls back to 3000).
# start:prod runs `prisma db push` (creates/syncs tables) then boots the server.
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
