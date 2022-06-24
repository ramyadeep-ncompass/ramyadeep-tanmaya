import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gurad';
import { LocalAuthGuard } from 'src/auth/local.auth.gaurd';
import { RepoService } from 'src/repo/repo.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
        private readonly repoService: RepoService,
        private readonly authService: AuthService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() user: { email: string, password: string }) {
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('repositories')
    async getUserRepo() {
        return { repositories: await this.repoService.getUsersRepos() };
    }
}
