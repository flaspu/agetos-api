import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { contacts, users, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class ContactService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async get(id: number): Promise<Array<contacts> | null> {
        const contacts = this.prisma.contacts.findMany({
            where: {
                OR: [
                    {
                        userId: id,
                    }
                ]
            },
        });
        
        return contacts;
    }
}
