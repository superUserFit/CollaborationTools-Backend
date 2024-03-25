import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { CreateNewRoom } from './dto/create-new-room.dto';
import { Liveblocks } from '@liveblocks/node';


@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name)
        private roomModel: Model<Room>
    ){}

    async createNewDesign(createNewRoom:CreateNewRoom):Promise<{ room:any , message: string }> {
        const { roomName } = createNewRoom;

        const existingRoom = await this.roomModel.findOne({roomName});

        if(existingRoom) {
            return { room:null, message: 'Room with this name already exist.'}
        }

        const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });

        const liveblocksRoom = await liveblocks.createRoom(roomName, {
            defaultAccesses: ['room:write']
        });

        await this.roomModel.create({ roomName });

        return { room: liveblocksRoom, message: 'A room has been created.' };
    }
}