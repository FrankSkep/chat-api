import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3033, { cors: { origin: '*' } })
export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    private server: Server;

    afterInit(server: Server) {
        this.server = server;
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`client connected ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket,
    ): string {
        console.log(`message: ${message}`);
        this.server.emit('message', message);
        return message;
    }
}
