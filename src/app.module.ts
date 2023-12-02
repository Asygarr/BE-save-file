import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [],
  imports: [UsersModule, PostsModule, AuthModule],
})
export class AppModule {}
