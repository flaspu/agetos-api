import { Controller, Get, Post, Res, Req, UseGuards, Body, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from './user.service';
import { GlobalService } from '../globals/globals.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService, private readonly globalService: GlobalService) {}

    @Post('api/register')
    async register(@Body('username') username: string, @Body('password') password: string, @Body('email') email: string, @Body('phone_number') phoneNumber: string): Promise<boolean> {
        let salt = this.globalService.randomString(10);
        const user = await this.userService.register(username, password, email, phoneNumber, salt);
        if(user) {
            return true;
        } else {
            return false;
        }
    }

    @Post('api/login')
    async login(@Body('username') name: string, @Body('password') password: string): Promise<string> {
        const user = await this.userService.login(name, password);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/auth/me')
    async authMe(@Request() req): Promise<object> {
        return req.user;
    }
}
