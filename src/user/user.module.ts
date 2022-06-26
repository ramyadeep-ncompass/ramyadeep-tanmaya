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
import { jwtConstants } from 'src/auth/jwt.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Repo]),
    HttpModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),],
  controllers: [UserController],
  providers: [UserService, RepoService, AuthService],
  exports: [UserService]
})
export class UserModule { }
