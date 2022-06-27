import { BadRequestException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repo } from 'src/repo/repo.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Controller, Get, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from './logger.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Repo)
        private usersRepoRepository: Repository<Repo>,
        private httpService: HttpService,
        private logger: LoggerService
    ) { }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email: email } });
    }


    async getUsersRepos(email: string) {
        console.log(`logged in as ${email}`);
        // let source;
        // const userRepos: [] = await this.cacheManager.get(email);

        // if (!userRepos) {
        //     const currentRepos = await this.usersRepoRepository.find({ where: { email: email } });
        //     await this.cacheManager.set(email, currentRepos, { ttl: 3600 });
        //     source = 'database';
        // }
        // else
        //     source = 'redis cache';

        // if (userRepos.length === 0)
        //     throw new NotFoundException('No Repository found!');

        // return {
        //     success: true,
        //     message: ` Repositories fetched.`, //${userRepos.length}
        //     repositories: userRepos,
        //     source
        // };

        const userRepos = await this.usersRepoRepository.find({ where: { email: email } });

        return {
            success: true,
            message: ` Repositories fetched.`, //${userRepos.length}
            repositories: userRepos,
        };
    }

    @Cron(CronExpression.EVERY_HOUR)
    async fetchRepositories() {
        const httpOptions = {
            headers: {
                'Authorization': 'token ' + process.env.GITHUB_TOKEN
            }
        }
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
                    this.logger.log({ message: 'Fetch repository api called', status: 'INFO' });
                }
                ).catch(err => {
                    this.logger.log({ message: err.data.code, status: 'WARNING' });
                   console.log(err);
                })
        }
        return {
            success: true,
            message: "Fetch repository function called",
        }
    }
}
