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
        private UserModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDTO:SignUpDTO): Promise<{ token: string, message: string }> {
        const { firstName, lastName, username, email, password } = signUpDTO;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.UserModel.create({
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

        const user = await this.UserModel.findOne({ email: email });

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

    async getUser(req: Request): Promise<{ status: number, user: any }> {
        const user = await this.UserModel.findById(req['user'].id).select('-password');

        if (!user) {
            return { status: 404, user: null };
        }

        return { status: 200, user: user };
    }


    async updateProfile(updateProfileDTO: UpdateProfileDTO, req: Request): Promise<{ status: number, user: any, message: string }> {
        try {
            const existingUser = await this.UserModel.findById(req['user'].id);

            if (!existingUser) {
                return { status: 404, user: '', message: 'User not found' };
            }

            const fieldsToUpdate = ['firstName', 'lastName', 'username', 'role'];

            for (const field of fieldsToUpdate) {
                if (updateProfileDTO[field]) {
                    existingUser[field] = updateProfileDTO[field];
                }
            }

            const updatedUser = await existingUser.save();

            return { status: 200, user: updatedUser, message: 'Profile updated successfully' };
        } catch (error) {
            return { status: 500, user: '', message: 'Failed to update profile' };
        }
    }


    async deleteAccount(req: Request): Promise<{ status: number, message: string }> {
        try {
            const user = await this.UserModel.findByIdAndDelete(req['user'].id);

            if(!user) {
                return { status: 404, message: 'User with this email does not exist.' };
            }

            return { status: 200, message: 'User account successfully deleted.' };
        } catch(error) {
            return { status: 500, message: 'Failed to delete user account due to Internal error'};
        }
    }
}
