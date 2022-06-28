import {  CacheModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repo } from 'src/repo/repo.entity';
import { RepoService } from 'src/repo/repo.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import * as redisStore from 'cache-manager-redis-store'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forFeature([User, Repo]),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
    CacheModule.register({
      store: redisStore,
        socket:{
          host: process.env.HOST,
          port: 6379
        }
    }),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, RepoService, AuthService,LoggerService],
  exports: [UserService]
})
export class UserModule { }
