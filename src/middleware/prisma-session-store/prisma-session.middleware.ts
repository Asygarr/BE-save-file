// prisma-session.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaSessionMiddleware implements NestMiddleware {
  private readonly prismaSessionStore: PrismaSessionStore;

  constructor() {
    this.prismaSessionStore = new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    );
  }

  use(req: any, res: any, next: () => void) {
    expressSession({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
      },
      secret: 'a santa at nasa',  // Sesuaikan dengan secret Anda
      resave: true,
      saveUninitialized: true,
      store: this.prismaSessionStore,
    })(req, res, next);
  }
}
