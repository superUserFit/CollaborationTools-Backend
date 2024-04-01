import { Controller, Post, Req } from '@nestjs/common';
import { CreateNewRoomDTO } from './dto/create-new-room.dto';
import { RoomService } from './room.service';


@Controller('api/room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post('/create-room')
    createRoom(createNewRoomDTO:CreateNewRoomDTO, @Req() req): Promise<{ room:any }> {
        return this.roomService.createNewRoom(createNewRoomDTO, req);
    }
}