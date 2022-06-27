import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gurad';
import { LocalAuthGuard } from 'src/auth/local.auth.gaurd';
import { RepoService } from 'src/repo/repo.service';
import { LoginUserDto } from './login.user.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
        private readonly repoService: RepoService,
        private readonly authService: AuthService
    ) { }



    @UsePipes(ValidationPipe)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() user: LoginUserDto) {
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('repositories')
    async getUserRepo(@Request() req) {
        return await this.userService.getUsersRepos(req.user.email);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('update-repositories')
    async updateUserRepo(@Request() req) {
        return await this.userService.fetchRepositories();
    }


}
