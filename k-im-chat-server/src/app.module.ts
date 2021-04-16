import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm';
import { Log4jsModule } from '@nestx-log4js/core';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FriendModule } from './modules/friend/friend.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig as TypeOrmModuleOptions),
    Log4jsModule.forRoot(),
    UserModule,
    AuthModule,
    ChatModule,
    FriendModule,
  ],
})
export class AppModule {}
