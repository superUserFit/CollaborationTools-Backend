import { Injectable } from '@nestjs/common';
import { Liveblocks } from '@liveblocks/node';

import { RoomRepository } from './room.repository';
import { CreateRoomRequest, DeleteRoomRequest } from './api/requests';


@Injectable()
export class RoomService {
    constructor(
        private readonly RoomRepository: RoomRepository
    ){}

    async createNewRoom(createRoomRequest:CreateRoomRequest):Promise<{ room:any , message: string }> {
        const room = await this.RoomRepository.createRoom(createRoomRequest);
        const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });

        const liveblocksRoom = await liveblocks.createRoom(room.roomName, {
            defaultAccesses: ['room:write']
        });

        return { room: liveblocksRoom, message: 'A room has been created.' };
    }

    async getIndexRoom(req: Request):Promise<{ rooms: any }> {
        const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });
        const rooms = await liveblocks.getRooms();

        return { rooms: rooms };
    }

    async deleteRoom(deleteRequest: DeleteRoomRequest):Promise<{ message:string }> {
        const { roomName } = deleteRequest;
        const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });

        await liveblocks.deleteRoom(roomName);

        return { message: 'Room deleted successfully.' };
    }
}