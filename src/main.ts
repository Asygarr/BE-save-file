import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { VerifyUserMiddleware } from './middleware/verify-user.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const verifyUserMiddleware = new VerifyUserMiddleware();
  const prisma = new PrismaClient();

  dotenv.config();
  
  app.use(
    session({
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // ms
        secure: 'auto',
      },
      secret: process.env.SESSION_SECRET,  // Sesuaikan dengan secret Anda
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  // app.use(verifyUserMiddleware.use);

  await app.listen(3000);
}
bootstrap();
