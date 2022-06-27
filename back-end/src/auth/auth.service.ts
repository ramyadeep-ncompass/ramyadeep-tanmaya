import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
const md5 = require('md5');

@Injectable()
export class AuthService {
    constructor(private usersService: UserService,
        private jwtService: JwtService,) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        if (user && user.password === md5(pass)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: { email: string, password: string }) {
        const payload = { email: user.email }
        const token = this.jwtService.sign(payload);
        return {
            token,
        };
    }
}
