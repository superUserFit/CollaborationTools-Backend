import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateProfileDTO {
    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email cannot be empty.'})
    readonly email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be 8 characters or above.'})
    readonly password: string;
}