import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>){}

    // save message to the database
    async addMessage(sender: string, content: string, room : string): Promise<Message> {
        const message = new this.messageModel({ sender, content, room });
        return message.save();
    }
    
    // get all messages from a room
    async getMessages(room: string): Promise<Message[]> {
        const messages = await this.messageModel.find({ room }).exec();
        return this.messageModel.find({ room }).exec();
    }

    // delete all messages from a room
    async deleteMessages(room: string): Promise<void> {
        await this.messageModel.deleteMany({ room: String(room) }).exec();
    }
}