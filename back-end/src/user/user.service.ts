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
        private logger: LoggerService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email: email } });
    }


    async getUsersRepos(email: string) {
        console.log(`logged in as ${email}`);
        let source;
        let userRepos: [] = await this.cacheManager.get(email);
        let currentRepos;

        if (!userRepos) {
            currentRepos = await this.usersRepoRepository.find({ where: { email: email } });
            await this.cacheManager.set(email, currentRepos, { ttl: 3600 });
            source = 'database';
            userRepos = currentRepos;
        }
        else
            source = 'redis cache';


        return {
            success: true,
            message: ` Repositories fetched.`, //${userRepos.length}
            repositories: userRepos,
            source
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
        for (let githubUser = 0; githubUser < users.length; githubUser++) {
            const url = `https://api.github.com/users/${users[githubUser].username}/repos`;
            const response = await this.httpService.get(url).toPromise();
            for (let githubApiAttribute = 0; githubApiAttribute < response.data.length; githubApiAttribute++) {
                const repoDetails = {
                    repositoryOwner: response.data[githubApiAttribute].owner.login,
                    repositoryName: response.data[githubApiAttribute].name,
                    repositoryId: response.data[githubApiAttribute].id,
                    email: users[githubUser].email,
                    repositoryUrl: response.data[githubApiAttribute].owner.repos_url,
                    cloneUrl: response.data[githubApiAttribute].clone_url,
                    contributorsUrl: response.data[githubApiAttribute].contributors_url
                }
                this.usersRepoRepository.save(repoDetails);
            }

        }
        this.logger.log({ message: 'Fetch repository api called', status: 'INFO' });
        return {
            success: true,
            message: "Fetch repository function called",
        }
    }
}
