import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from './user.repository';
import { Helpers } from 'src/common/Helpers';
import { LoginRequest, SignUpRequest, UpdateProfileRequest } from './api/requests';

@Injectable()
export class UserService {
    constructor(
        private readonly UserRepository: UserRepository,
        private readonly Helpers: Helpers,
        private JwtService: JwtService
    ) {}

    async signUp(signUpRequest:SignUpRequest): Promise<{ token: string, message: string }> {
        const user = await this.UserRepository.createUser(signUpRequest);

        const token = this.JwtService.sign({ id: user._id });

        return { token: token, message: 'Signup successful.' };
    }

    async login(loginRequest:LoginRequest): Promise<{ token:string, message: string }> {
        const user = await this.UserRepository.login(loginRequest);

        const token = this.JwtService.sign({ id: user._id });

        return { token: token, message: 'Login successfull' };
    }

    async getUser(req: Request): Promise<{ user: any }> {
        const user = await this.UserRepository.getUser(req);

        return { user: user };
    }

    async updateProfile(updateProfileRequest: UpdateProfileRequest): Promise<{ user: any, message: string }> {
        const fieldsToUpdate = ['firstName', 'lastName', 'username', 'role'];

        const updatedUser = await this.UserRepository.updateProfile(updateProfileRequest, fieldsToUpdate);

        return { user: updatedUser, message: 'Update profile successfully' };
    }

    async deleteAccount(req: Request): Promise<{ message: string }> {
        await this.UserRepository.deleteUser(req);

        return { message: 'User deleted successfully' };
    }
}