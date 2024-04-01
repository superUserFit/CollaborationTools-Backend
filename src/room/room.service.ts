import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { CreateNewRoomDTO } from './dto/create-new-room.dto';
import { Liveblocks } from '@liveblocks/node';


@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name)
        private roomModel: Model<Room>
    ){}

    async createNewRoom(createNewRoomDTO:CreateNewRoomDTO, req:Request):Promise<{ status: number, room:any , message: string }> {
        try {
            const { roomName } = createNewRoomDTO;

            const existingRoom = await this.roomModel.findOne({ roomName });

            if(existingRoom) {
                return { status: 401, room:null, message: 'Room with this name already exist.'}
            }

            const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });

            const liveblocksRoom = await liveblocks.createRoom(roomName, {
                defaultAccesses: ['room:write']
            });

            await this.roomModel.create({ roomName, admin: req['user'].id  , users: req['user'].id});

            return { status: 200, room: liveblocksRoom, message: 'A room has been created.' };
        } catch (error) {
            return { status: 500, room: null, message: 'Internal server error' };
        }
    }
}