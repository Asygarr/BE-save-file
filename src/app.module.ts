import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { VerifyUserMiddleware } from './middleware/verify-user.middleware';
import { UsersController } from './users/users.controller';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyUserMiddleware)
      .forRoutes(UsersController, PostsController);
  }
}
