import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';


@Schema({
    timestamps: true
})

export class Room {
    @Prop()
    roomName: string

    @Prop([{ type:  MongooseSchema.Types.ObjectId, ref: 'User' }])
    admin: MongooseSchema.Types.ObjectId[];

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
    users: MongooseSchema.Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);