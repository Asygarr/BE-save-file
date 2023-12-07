import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ResponseHandler } from 'src/utils/response-handler';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ResponseHandler, PrismaClient],
})
export class PostsModule {}
