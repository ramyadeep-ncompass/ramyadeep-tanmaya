import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UserService,
        private jwtService: JwtService,) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: { email: string, password: string }) {
        const payload = { email: user.email }
        const token = this.jwtService.sign(payload);
        console.log(token);
        return {
            access_token: token,
        };
    }
}
