import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Room extends Document {
    @Prop({ required: true })
    name: string; // room name

    @Prop()
    password?: string; // room password

    @Prop({ default: Date.now })
    createdAt: Date; // room creation date
}

export const RoomSchema = SchemaFactory.createForClass(Room);
