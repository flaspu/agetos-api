import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { users, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(username: string, password: string, email: string, phoneNumber: string, salt: string): Promise<users | null> {
        let hashedPassword = await argon2.hash(password, {
            salt: Buffer.from(salt),
        });

        const user = await this.prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                email: email,
                salt: salt,
                phone_number: phoneNumber,
            }
        })

        if(user) {
            return user;
        }
        return null;
    }

    async login(username: string, password: string): Promise<string> {
        const user: any = await this.prisma.users.findFirst({
            select: {
                id: true,
                username: true,
                password: true,
                salt: true,
                email: true,
                phone_number: true,
                custom_status: true,
            },
            where: {
                username: username,
            }
        });

        if(user) {
            let verify = await argon2.verify(user.password, password, {
                salt: Buffer.from(user.salt),
            });
            if(verify) {
                delete user.password;
                delete user.salt;
                
                const payload = this.jwtService.sign(user);
                return payload;
            }
        }
        return null;
    }

    async authMe(data: any): Promise<object> {
        const user: any = await this.prisma.users.findFirst({
            select: {
                id: true,
                username: true,
                password: true,
                salt: true,
                email: true,
                phone_number: true,
                custom_status: true,
            },
            where: {
                id: data.id,
            }
        });
        return user;
    }
}
