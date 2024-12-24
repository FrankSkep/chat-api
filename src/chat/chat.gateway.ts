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
    private users: Map<string, string> = new Map();

    constructor(private readonly chatService: ChatService) {}

    afterInit(server: Server) {
        this.server = server;
    }

    handleConnection(client: Socket) {
        const username = client.handshake.query.username as string;
        if (username) {
            this.users.set(client.id, username);
            this.server.emit('notification', `User ${username} connected`);
        } else {
            this.server.emit('notification', `User ${client.id} connected`);
        }
    }
    
    handleDisconnect(client: Socket) {
        const username = this.users.get(client.id) || `User ${client.id}`;
        this.server.emit('notification', `${username} disconnected`);
        this.users.delete(client.id);
    }

    @SubscribeMessage('setUsername')
    handleSetUsername(@MessageBody() username: string, @ConnectedSocket() client: Socket) {
        this.users.set(client.id, username);
    }

    @SubscribeMessage('createRoom')
    async handleCreateRoom(@MessageBody() { name, password }: { name: string, password?: string }, @ConnectedSocket() client: Socket) {
        const room = await this.chatService.createRoom(name, password);
        client.emit('roomCreated', room);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() { room, username, password }: { room: string, username: string, password?: string }, @ConnectedSocket() client: Socket) {
        const roomData = await this.chatService.findRoomByName(room);
        if (roomData && (!roomData.password || roomData.password === password)) {
            client.join(room);
            const messages = await this.chatService.getMessages(room);
            client.emit('messageHistory', messages);
            client.to(room).emit('notification', `${username} has joined room ${room}`);
        } else {
            client.emit('notification', 'Incorrect room password');
        }
    }

    @SubscribeMessage('getRooms')
    async handleGetRooms(@ConnectedSocket() client: Socket) {
        const rooms = await this.chatService.getRooms();
        client.emit('rooms', rooms.map(({ name, password }) => ({
            name,
            protected: !!password,
        })));
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        const username = this.users.get(client.id) || `User ${client.id}`;
        client.leave(room);
        client.to(room).emit('notification', `${username} has left the room`);
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() { sender, content, room }: { room: string, content: string, sender: string }, @ConnectedSocket() client: Socket): Promise<void> {
        const message = await this.chatService.addMessage(sender, content, room);
        this.server.to(room).emit('message', { content, sender, createdAt: message.createdAt });
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() { room, username }: { room: string, username: string }, @ConnectedSocket() client: Socket) {
        client.to(room).emit('typing', `${username} is typing...`);
    
        // Clear previous timeout if exists
        if (client.typingTimeout) {
            clearTimeout(client.typingTimeout);
        }

        // Set a timeout to clear the typing message after 3 seconds of inactivity
        client.typingTimeout = setTimeout(() => {
            client.to(room).emit('typing', '');
        }, 2200);
    }

    @SubscribeMessage('deleteMessages')
    async handleDeleteMessages(@MessageBody() room: string, @ConnectedSocket() client: Socket): Promise<void> {
        await this.chatService.deleteMessages(room);
        client.to(room).emit('notification', 'All messages have been deleted');
    }
}
