import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Repo } from "./repo.entity";

@Injectable()
export class RepoService {
    constructor(
        @InjectRepository(Repo)
        private usersRepoRepository: Repository<Repo>,
    ) { }

    async getUsersRepos() {
        console.log('user repository');
        return await this.usersRepoRepository.find();
    }
}
