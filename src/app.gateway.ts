import {
    SubscribeMessage,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from './user/user.service';
import { messages } from '@prisma/client';
import internal from 'stream';
import { subscribeOn } from 'rxjs';

type IMessageData = {
    text: string,
    room: string,
    date: Date,
}

@WebSocketGateway({
    cors: {
        origin: '*:*',
        credentials: true,
        methods: ["GET", "POST"],
    },
    allowEIO3: true
})

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private appService: UserService) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage('subscribe')
    async subscribe(client: Socket, room: string) {
        console.log('subscribed to room ' + room);
        client.join(room);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: IMessageData): Promise<void> {
        
        console.log(payload);
        // this.server.on(`sendMessage`, (anotherSocketId: string | string[], payload: IMessageData) => {
        //     this.server.to(anotherSocketId).emit('sendMessage', payload);
        // });

        this.server.to(payload.room).emit(`conversation[${payload.room}]`, {
            message: payload.text
        })
    }

    afterInit(server: Server) {
        setTimeout(() => {
            console.log('\x1b[36m%s\x1b[0m', '[Agetos] Socket created.');
        }, 0)
        //Do stuff
    }

    handleDisconnect(client: Socket) {
        console.log(`Disconnected: ${client.id}`);
        //Do stuff
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`);
        //Do stuff
    }
}