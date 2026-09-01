import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'node:fs';
import { AppModule } from './app.module';
import { ADMIN_UI_DIR, UPLOADS_DIR, UPLOADS_ROUTE } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // The Vite dev server proxies `/api` here, but allow direct cross-origin
  // calls too (e.g. a separately-hosted frontend in production).
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // Serve uploaded images (under /api/... so the web proxy reaches them) and
  // the static admin UI (at /admin on the API origin).
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
  app.useStaticAssets(UPLOADS_DIR, { prefix: UPLOADS_ROUTE });
  if (existsSync(ADMIN_UI_DIR)) {
    app.useStaticAssets(ADMIN_UI_DIR, { prefix: '/admin' });
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`6baqa API listening on http://localhost:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`6baqa admin UI at http://localhost:${port}/admin`);
}

void bootstrap();
