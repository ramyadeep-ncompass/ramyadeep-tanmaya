import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repo } from 'src/repo/repo.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

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
        console.log(`logged in as ${email}`);
        const userRepos = await this.usersRepoRepository.find({ where: { email: email } });
        return userRepos;
    }

    @Cron(CronExpression.EVERY_HOUR)
    async fetchRepositories() {
        console.log('Fetch repository api called');
        const users = await this.usersRepository.find();
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
                        this.usersRepoRepository.save(repoDetails);
                    }
                }
                ).catch(err => console.log(err))
        }
    }

    // @Cron('5 * * * * *')
    // cronService(){
    //     console.log('cron Services');
    // }
}
