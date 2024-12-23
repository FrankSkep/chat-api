import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { Room, RoomSchema } from 'src/schemas/room.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])
    ],
    providers: [ChatGateway, ChatService],
})
export class ChatModule {}
