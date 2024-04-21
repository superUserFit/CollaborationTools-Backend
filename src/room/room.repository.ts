import { BadRequestException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Room } from "./model/room.schema";
import { User } from "src/user/model/user.schema";


@Injectable()
export class RoomRepository {
    constructor (
        @InjectModel(Room.name)
        private RoomModel: Model<Room>,

        @InjectModel(User.name)
        private UserModel: Model<User>
    ) {}

    public createRoom = async (request) => {
        const { roomName, user_id } = request;

        const existingRoom = await this.RoomModel.findOne({ roomName });

        if(existingRoom) {
            throw new NotAcceptableException('Room already exist.');
        }

        const user = await this.UserModel.findById(user_id);

        const room = await this.RoomModel.create({ roomName, admin: user._id, users: user._id });

        return room;
    }

    public getIndexRoom = async (user_id) => {
        const rooms = await this.RoomModel.find({ users: user_id });

        return rooms;
    }

    public deleteRoom = async (request) => {
        const { roomName, user_id } = request;
        const room = await this.RoomModel.findOne({ roomName:roomName });

        if(room.admin !== user_id) {
            throw new UnauthorizedException('Unauthorized user.');
        }

        await room.deleteOne();

        return true;
    }
}