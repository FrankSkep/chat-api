import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Room extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    password?: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);