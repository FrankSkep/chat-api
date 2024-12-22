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

@WebSocketGateway(3033, { cors: { origin: '*' } })
export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    private server: Server;

    constructor(private readonly chatService: ChatService) {}

    afterInit(server: Server) {
        this.server = server;
    }

    handleConnection(client: Socket) {
        this.server.emit('notification', `User ${client.id} connected`);
    }
    
    handleDisconnect(client: Socket) {
        this.server.emit('notification', `Usuario ${client.id} disconnected`);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() { room, username }: { room: string, username: string }, @ConnectedSocket() client: Socket) {
        client.join(room);
        const messages = await this.chatService.getMessages(room);
        client.emit('messageHistory', messages);
        client.to(room).emit('notification', `${username} has joined room ${room}`);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.leave(room);
        client.to(room).emit('notification', `${client.id} has left the room`);
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() { sender, content, room }: { room: string, content: string, sender: string }, @ConnectedSocket() client: Socket): Promise<void> {
        await this.chatService.addMessage(sender, content, room);
        this.server.to(room).emit('message', { content, sender });
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() { room, username }: { room: string, username: string }, @ConnectedSocket() client: Socket) {
        client.to(room).emit('typing', `${username} is typing...`);
    }

    @SubscribeMessage('deleteMessages')
    async handleDeleteMessages(@MessageBody() room: string, @ConnectedSocket() client: Socket): Promise<void> {
        await this.chatService.deleteMessages(room);
        client.to(room).emit('notification', 'All messages have been deleted');
    }
}
