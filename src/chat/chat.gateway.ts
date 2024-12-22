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
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway(3033, { cors: { origin: '*' } })
export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    private server: Server;

    constructor(private readonly chatService: ChatService) {}

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
    async handleMessage(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket,): Promise<String> {
        console.log(`message: ${createMessageDto.content} from ${client.id}`);
        await this.chatService.addMessage(createMessageDto.content);
        this.server.emit('message', createMessageDto.content);
        return createMessageDto.content;
    }
}
