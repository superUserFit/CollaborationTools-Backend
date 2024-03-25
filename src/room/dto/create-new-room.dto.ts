import { IsString, MinLength } from 'class-validator';

export class CreateNewRoom {
    @IsString()
    @MinLength(4, { message: 'Minimum 4 characters'})
    readonly roomName: string
}