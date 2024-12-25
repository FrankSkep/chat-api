import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
    @Prop({ required: true })
    sender: string; // message sender username

    @Prop({ required: true })
    content: string; // message content

    @Prop({ required: true })
    room: string; // room name

    @Prop({ default: Date.now })
    createdAt: Date; // message creation date
}

export const MessageSchema = SchemaFactory.createForClass(Message);
