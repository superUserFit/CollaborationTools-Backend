import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true
})

export class Room {
    @Prop()
    roomName: string
}

export const RoomSchema = SchemaFactory.createForClass(Room);