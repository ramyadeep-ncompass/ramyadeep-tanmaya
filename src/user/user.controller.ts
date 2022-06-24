import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('login')
    async login(@Body() user: { email: string, password: string }) {
        return this.userService.getUserByEmail(user.email);
    }

    @Get('repositories')
    async getUserRepo() {
        return { repositories: 'User Repositories' };
    }
}
