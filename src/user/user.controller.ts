import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthMiddleware } from 'src/middleware/Auth.middleware';
import { UpdateProfileDTO } from './dto/update-profile.dto';

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

    @Patch()
    @UseGuards(AuthMiddleware)
    updateProfile(@Body() updateProfileDTO: UpdateProfileDTO, @Req() req) <{ user: any }> {
        const user = req.user;
        return this.userService.updateProfile(updateProfileDTO, user);
    }
}
