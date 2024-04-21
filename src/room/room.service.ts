import { ForbiddenException, Injectable } from '@nestjs/common';
import { Liveblocks } from '@liveblocks/node';

import { RoomRepository } from './room.repository';
import { CreateRoomRequest, DeleteRoomRequest } from './api/requests';


@Injectable()
export class RoomService {
    private readonly liveblocks: Liveblocks;
    constructor(private readonly RoomRepository: RoomRepository){
        this.liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });
    }

    async createNewRoom(createRoomRequest:CreateRoomRequest):Promise<{ room:any , message: string }> {
        const room = await this.RoomRepository.createRoom(createRoomRequest);

        const liveblocksRoom = await this.liveblocks.createRoom(room.roomName, {
            defaultAccesses: ['room:write']
        });

        return { room: liveblocksRoom, message: 'A room has been created.' };
    }

    async getIndexRoom(user_id):Promise<{ rooms: any }> {
        const rooms = await this.RoomRepository.getIndexRoom(user_id);

        const liveblockRooms = await this.liveblocks.getRooms({ groupIds: rooms });

        return { rooms: liveblockRooms };
    }

    async deleteRoom(deleteRequest: DeleteRoomRequest):Promise<{ message:string }> {
        const deleteRoom = await this.RoomRepository.deleteRoom(deleteRequest);

        if(!deleteRoom) {
            throw new ForbiddenException('Failed to delete room.');
        }

        await this.liveblocks.deleteRoom(deleteRequest.roomName);

        return { message: 'Room deleted successfully.' };
    }
}