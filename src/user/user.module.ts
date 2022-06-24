import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repo } from 'src/repo/repo.entity';
import { RepoService } from 'src/repo/repo.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,Repo])],
  controllers: [UserController],
  providers: [UserService,RepoService],
})
export class UserModule {}
