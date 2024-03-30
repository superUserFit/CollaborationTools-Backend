import { IsString, MinLength } from 'class-validator';

export class CreateNewRoomDTO {
    @IsString()
    @MinLength(4, { message: 'Minimum 4 characters'})
    readonly roomName: string
}