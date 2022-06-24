import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repo } from 'src/repo/repo.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Repo)
        private usersRepoRepository: Repository<Repo>,
    ) { }

    async getUserByEmail(email:string){
        return await this.usersRepository.findOne({where:{email:email}});
    }

    async getUsersRepos() {
        return await this.usersRepoRepository.find();
    }
}
