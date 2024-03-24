import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('api/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/signup')
    signUp(@Body() signUpDTO: SignUpDTO): Promise<{ token:string }> {
        return this.userService.signUp(signUpDTO);
    }

    @Post('/login')
    login(@Body() loginDTO: LoginDTO): Promise<{ token:string }> {
        return this.userService.login(loginDTO);
    }
}
