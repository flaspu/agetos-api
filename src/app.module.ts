import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { ContactController } from './contacts/contacts.controller';
import { UserService } from './user/user.service';
import { ContactService } from './contacts/contacts.service';
import { PrismaService, TestService } from './prisma.service';
import { GlobalService } from './globals/globals.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt';
import { AppGateway } from './app.gateway';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '7d',
            }
        }),
    ],
    controllers: [
        UserController,
        ContactController
    ],
    providers: [
        UserService,
        ContactService,
        GlobalService,
        AppGateway,
        PrismaService,
        TestService,
        JwtStrategy
    ],
})
export class AppModule {}
