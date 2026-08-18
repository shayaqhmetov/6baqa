import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // The Vite dev server proxies `/api` here, but allow direct cross-origin
  // calls too (e.g. a separately-hosted frontend in production).
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`6baqa API listening on http://localhost:${port}/api`);
}

void bootstrap();
