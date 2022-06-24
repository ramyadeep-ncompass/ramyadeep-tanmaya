import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Repo } from 'src/repo/repo.entity';
import { RepoService } from 'src/repo/repo.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Repo]), HttpModule, JwtModule.register({
    secretOrPrivateKey: 'jwtConstants.secret',
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [UserController],
  providers: [UserService,RepoService,AuthService],
  exports:[UserService]
})
export class UserModule {}
