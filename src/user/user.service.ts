import { HttpService, Injectable } from '@nestjs/common';
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
        private httpService: HttpService,
    ) { }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email: email } });
    }


    async getUsersRepos(email: string) {
        console.log(email);
        return await this.usersRepoRepository.find({ where: { email: email } });
    }


    async fetchRepositories() {
        const users = await this.usersRepository.find();
        // let repo = [];
        this.usersRepoRepository.clear();
        for (let i = 0; i < users.length; i++) {
            const url = `https://api.github.com/users/${users[i].username}/repos`;
            await this.httpService.get(url).toPromise()
                .then(res => {
                    for (let j = 0; j < res.data.length; j++) {
                        const repoDetails = {
                            repositoryOwner: res.data[j].owner.login,
                            email: users[i].email,
                            repositoryId: res.data[j].id,
                            repositoryName: res.data[j].name,
                            repositoryUrl: res.data[j].owner.repos_url,
                            cloneUrl: res.data[j].clone_url,
                            contributorsUrl: res.data[j].contributors_url
                        }
                        // console.log(repoDetails);
                        // repo.push(repoDetails);
                        this.usersRepoRepository.save(repoDetails);
                    }
                }
                ).catch(err => console.log(err))
        }
    }
}
