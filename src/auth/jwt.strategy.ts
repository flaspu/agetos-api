import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { users, contacts, Prisma } from '@prisma/client';
import { jwtConstants } from '../constants/jwt';

export interface IContactData {
  id: number,
  name: string,
  customStatus: string,
  active: boolean,
  image: string,
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const userData = await this.prisma.users.findUnique({
      select: {
        username: true,
        email: true,
        custom_status: true,
        phone_number: true,        
      },
      where: {
        id: payload.id,
      } 
    });

    const contactsData = await this.prisma.contacts.findMany({
      select: {
        userId: true,
        contactId: true,
      },
      where: {
        OR: [
          {
            userId: payload.id,
          },
          {
            contactId: payload.id,
          }
        ],
        status: 1
      }
    });

    let filteredContacts: Array<IContactData> = [];
    
    for(let contact of contactsData) {
      let user = await this.prisma.users.findUnique({
        where: {
          id: contact.userId,
        }
      });

      if(contact.userId == payload.id) {
        user = await this.prisma.users.findUnique({
          where: {
            id: contact.contactId,
          }
        });
      }

      filteredContacts.push({
        id: user.id,
        name: user.username,
        customStatus: user.custom_status,
        active: false,
        image: '/src/assets/media/memoji/Memoji-01.png',
      });
    }

    return {
      id: payload.id, 
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phone_number,
      customStatus: userData.custom_status,
      contacts: filteredContacts,
    };
  }
}
