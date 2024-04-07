import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { User } from 'src/user/user.schema';
import { CreateRoomDTO } from './dto/create-room.dto';
import { Liveblocks } from '@liveblocks/node';


@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name)
        private RoomModel: Model<Room>,

        @InjectModel(User.name)
        private UserModel: Model<User>
    ){}

    async createNewRoom(createRoomDTO:CreateRoomDTO, req:Request):Promise<{ status: number, room:any , message: string }> {
        try {
            const { roomName } = createRoomDTO;

            const existingRoom = await this.RoomModel.findOne({ roomName });

            if(existingRoom) {
                return { status: 401, room:null, message: 'Room with this name already exist.'}
            }

            const user = await this.UserModel.findById(req['user'].id);

            const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });

            const liveblocksRoom = await liveblocks.createRoom(roomName, {
                defaultAccesses: ['room:write']
            });

            await this.RoomModel.create({ roomName, admin: user._id  , users: user._id });

            return { status: 200, room: liveblocksRoom, message: 'A room has been created.' };
        } catch (error) {
            console.error(error);
            return { status: 500, room: null, message: 'Internal server error' };
        }
    }
}