import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import serverless from "serverless-http";

import { AppModule } from "../src/app.module";

let cachedHandler: ReturnType<typeof serverless> | undefined;

async function bootstrap() {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(",") ?? true,
      credentials: true
    });
    await app.init();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }

  return cachedHandler;
}

export default async function handler(req: Parameters<ReturnType<typeof serverless>>[0], res: Parameters<ReturnType<typeof serverless>>[1]) {
  const server = await bootstrap();
  return server(req, res);
}
