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
import {
    LoginRequest,
    SignUpRequest,
    UpdateProfileRequest
} from './api/requests';

@Controller('api/user')
export class UserController {
    constructor(private UserService: UserService) {}

    @Post('/signup')
    signUp(@Body() signUpRequest: SignUpRequest): Promise<{ token:string }> {
        return this.UserService.signUp(signUpRequest);
    }

    @Post('/login')
    login(@Body() loginRequest: LoginRequest): Promise<{ token:string }> {
        return this.UserService.login(loginRequest);
    }

    @Get('/get-user')
    getUser(@Req() req): Promise<{ user:any }> {
        return this.UserService.getUser(req);
    }

    @Patch('/update-profile')
    updateProfile(@Body() updateProfileRequest: UpdateProfileRequest, @Req() req): Promise<{ user: any }> {
        const request = updateProfileRequest;
        request.user_id = req['user'].id;

        return this.UserService.updateProfile(request);
    }


    @Delete('/delete-user')
    deleteUserAccount(@Req() req) {
        return this.UserService.deleteAccount(req);
    }
}
