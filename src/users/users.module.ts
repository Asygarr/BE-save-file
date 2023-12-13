import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaClient } from '@prisma/client';
import { ResponseHandler } from 'src/util/response-handler';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaClient, ResponseHandler],
  exports: [UsersService],
})
export class UsersModule {}
