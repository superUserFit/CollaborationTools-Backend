import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDTO:SignUpDTO): Promise<{ token: string, message: string }> {
        const { firstName, lastName, username, email, password } = signUpDTO;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        const token = this.jwtService.sign({ id: user._id });

        return { token, message: 'Signup successfull' };
    }

    async login(loginDTO:LoginDTO): Promise<{ status: number, token:string, message: string }> {
        const { email, password } = loginDTO;

        const user = await this.userModel.findOne({ email: email });

        if(!user) {
            return { status: 401, token: '', message: 'Invalid email or password.'};
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            return { status: 401, token: '', message: 'Invalid email or password.'};
        }

        const token = this.jwtService.sign({ id: user._id });

        return { status: 200, token, message: 'Login successfull' };
    }

    async updateProfile(updateProfileDTO:UpdateProfileDTO, @Req req): Promise<{ status: number, user: any }> {
        const { firstName, lastName, username, email, password } = updateProfileDTO;
    }
}
