import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prisma = new PrismaClient();

  dotenv.config();

  app.use(
    session({
      cookie: {
        maxAge: 3 * 24 * 60 * 60 * 1000,
      },
      secret: process.env.SESSION_SECRET, // Sesuaikan dengan secret Anda
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.enableCors();
  app.useStaticAssets('public');

  await app.listen(8000);
}
bootstrap();
