import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { CreateRoomRequest, DeleteRoomRequest } from './api/requests';
import { RoomService } from './room.service';


@Controller('api/room')
export class RoomController {
    constructor(private RoomService: RoomService) {}

    @Post('/create-room')
    createRoom(@Body() createRoomRequest:CreateRoomRequest, @Req() req): Promise<{ room:any }> {
        const request = createRoomRequest;
        request.user_id = req['user'].id;

        return this.RoomService.createNewRoom(request);
    }

    @Get('/get-index-room')
    getIndexRoom(@Req() req): Promise<{ rooms:any }> {
        return this.RoomService.getIndexRoom(req);
    }

    @Delete('/delete-room')
    deleteRoom(@Body() deleteRoomRequest:DeleteRoomRequest, @Req() req): Promise<{ message:any }> {
        const request = deleteRoomRequest;
        request.user_id = req['user'].id;

        return this.RoomService.deleteRoom(deleteRoomRequest);
    }
}