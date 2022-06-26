import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
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

        if(userRepos.length === 0 || !userRepos)
            throw new NotFoundException('No Repositories are found!')


        return {
            success:true,
            message: `${userRepos.length} Repositories fetched.`,
            repositories: userRepos
        };
    }

    @Cron(CronExpression.EVERY_HOUR)
    async fetchRepositories() {
        const httpOptions = {
            headers: {
                'Authorization': 'Bearer '+process.env.GITHUB_TOKEN
            }
        }
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
                            repositoryName: res.data[j].name,
                            repositoryId: res.data[j].id,
                            email: users[i].email,
                            repositoryUrl: res.data[j].owner.repos_url,
                            cloneUrl: res.data[j].clone_url,
                            contributorsUrl: res.data[j].contributors_url
                        }
                        this.usersRepoRepository.save(repoDetails);
                    }
                }
                ).catch(err => console.log(err))
        }
        return {
            success: true,
            message: "Fetch repository function called",
        }
    }

    // @Cron('5 * * * * *')
    // cronService(){
    //     console.log('cron Services');
    // }
}
