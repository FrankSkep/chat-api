import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>){}

    async addMessage(content: string) : Promise<Message> {
        const message = new this.messageModel({ content });
        return message.save();
    }

    async getMessages() : Promise<Message[]> {
        return this.messageModel.find().exec();
    }
}