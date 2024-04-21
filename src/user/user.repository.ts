//  Import third-party libraries
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';

//  Import custom components
import { User } from './model/user.schema';


@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>,
    ) {}

    public createUser = async (request) => {
        const { firstName, lastName, username, email, password } = request;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.UserModel.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        return user;
    }

    public login = async (request) => {
        const { email, password } = request;

        const user = await this.UserModel.findOne({ email: email });

        if(!user) {
            throw new NotFoundException('User Not Found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        return user;
    }

    public getUser = async (req) => {
        const user = await this.UserModel.findById(req['user'].id).select('-password');

        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return user;
    }

    public updateProfile = async (request, fieldsToUpdate:string[]) => {
        try {
            const existingUser = await this.UserModel.findById(request.user_id);

            if (!existingUser) {
                throw new NotFoundException('User Not Found');
            }

            for (const field of fieldsToUpdate) {
                if (request[field]) {
                    existingUser[field] = request[field];
                }
            }

            const updatedUser = await existingUser.save();

            return updatedUser;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteUser(req: Request) {
        try {
            await this.UserModel.findByIdAndDelete(req['user'].id);

            return true;
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

}