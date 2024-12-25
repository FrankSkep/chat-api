import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { Room } from 'src/schemas/room.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(Room.name) private roomModel: Model<Room>,
    ) {}

    // save message to the database
    async addMessage(
        sender: string,
        content: string,
        room: string,
    ): Promise<Message> {
        const message = new this.messageModel({ sender, content, room });
        return message.save();
    }

    // get all messages from a room
    async getMessages(room: string): Promise<Message[]> {
        return this.messageModel.find({ room }).exec() || [];
    }

    // delete all messages from a room
    async deleteMessages(room: string): Promise<void> {
        await this.messageModel.deleteMany({ room: String(room) }).exec();
    }

    // create a new room
    async createRoom(name: string, password?: string): Promise<Room> {
        const room = new this.roomModel({ name, password });
        return room.save();
    }

    // get all rooms
    async getRooms(): Promise<Room[]> {
        return this.roomModel.find().exec();
    }

    // find a room by name
    async findRoomByName(name: string): Promise<Room> {
        return this.roomModel.findOne({ name }).exec();
    }
}
