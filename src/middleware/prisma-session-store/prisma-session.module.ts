// home.module.ts atau controller yang sesuai
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaSessionMiddleware } from './prisma-session.middleware';

@Module({})
export class PrismaSessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrismaSessionMiddleware).forRoutes('*');
  }
}
