import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './middleware/Auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { RoomModule } from './room/room.module';
import { Helpers } from './common/Helpers';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    RoomModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Helpers],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude(
      { path: 'api/user/signup', method: RequestMethod.POST},
      { path: 'api/user/login', method: RequestMethod.POST},
    )
    .forRoutes(
      { path: 'api/user/*', method: RequestMethod.ALL },
      { path: 'api/room/*', method: RequestMethod.ALL }
    )
  }
}