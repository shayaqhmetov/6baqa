# Build context = repo root (needed for the npm workspace + lockfile).
# On Railway: Root Directory = repo root, Dockerfile Path = apps/web/Dockerfile
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY apps/web apps/web
RUN npm run build --workspace @6baqa/web

# --- Runtime: nginx serves the static build and proxies /api to the API ---
FROM nginx:alpine AS runtime

# nginx:alpine runs envsubst over /etc/nginx/templates/*.template at startup,
# injecting $PORT and $API_URL from the environment.
COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Defaults for local `docker run`; Railway overrides PORT and API_URL.
ENV PORT=8080
ENV API_URL=http://localhost:3000

EXPOSE 8080
