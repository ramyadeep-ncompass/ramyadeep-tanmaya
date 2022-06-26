import { HttpModule, Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forFeature([User, Repo]),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, RepoService, AuthService],
  exports: [UserService]
})
export class UserModule { }
