import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter the correct email.' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;
}