import { BadRequestException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repo } from 'src/repo/repo.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Controller, Get, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from './logger.service';
const fetchUrl = require("fetch").fetchUrl;

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
            const response = await fetchUrl(url);
            const result = await response.json();

            for (let j = 0; j < result.data.length; j++) {
                const repoDetails = {
                    repositoryOwner: result.data[j].owner.login,
                    repositoryName: result.data[j].name,
                    repositoryId: result.data[j].id,
                    email: users[i].email,
                    repositoryUrl: result.data[j].owner.repos_url,
                    cloneUrl: result.data[j].clone_url,
                    contributorsUrl: result.data[j].contributors_url
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
