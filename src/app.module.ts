import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PrismaSessionModule } from './middleware/prisma-session-store/prisma-session.module';

@Module({
  providers: [],
  imports: [UsersModule, PostsModule, PrismaSessionModule],
})
export class AppModule {}
