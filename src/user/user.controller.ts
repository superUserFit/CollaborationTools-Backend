import {
    Body,
    Controller,
    Patch,
    Post,
    Req,
    Get,
    Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
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

    @Get('/get-user')
    getUser(@Req() req): Promise<{ user:any }> {
        return this.userService.getUser(req);
    }

    @Patch('/update-profile')
    updateProfile(@Body() updateProfileDTO: UpdateProfileDTO, @Req() req): Promise<{ user: any }> {
        return this.userService.updateProfile(updateProfileDTO, req);
    }

    @Delete('/delete-user')
    deleteUserAccount(@Req() req) {
        return this.userService.deleteAccount(req);
    }
}
