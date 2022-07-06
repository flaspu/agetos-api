import { Controller, Get, Post, Res, Req, UseGuards, Body, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ContactService } from './contacts.service';
import { GlobalService } from '../globals/globals.service';

@Controller()
export class ContactController {
    constructor(private readonly contactService: ContactService, private readonly globalService: GlobalService) {}

    // @UseGuards(JwtAuthGuard)
    // @Get('api/contacts')
    // async contacts(@Request() req): Promise<object> {
    //     // // let payload = auth.replace('Bearer ', '');
    //     // return req.user;
    //     const contacts = await this.contactService.get(req.id);
    //     return contacts;
    // }
}
