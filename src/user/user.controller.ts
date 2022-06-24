import { Body, Controller, Get, Post } from '@nestjs/common';
import { RepoService } from 'src/repo/repo.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
    private readonly repoService: RepoService) { }

    @Post('login')
    async login(@Body() user: { email: string, password: string }) {
        return this.userService.getUserByEmail(user.email);
    }

    @Get('repositories')
    async getUserRepo() {
        return { repositories:await this.repoService.getUsersRepos() };
    }
}
