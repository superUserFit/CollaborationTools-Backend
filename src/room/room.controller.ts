import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomService } from './room.service';


@Controller('api/room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post('/create-room')
    createRoom(@Body() createRoomDTO:CreateRoomDTO, @Req() req): Promise<{ room:any }> {
        return this.roomService.createNewRoom(createRoomDTO, req);
    }
}