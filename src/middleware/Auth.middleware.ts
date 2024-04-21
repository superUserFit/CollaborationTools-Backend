import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { Helpers } from "src/common/Helpers";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly JwtService: JwtService,
        private readonly Helpers: Helpers
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        try {
            const user = await this.JwtService.verify(JSON.parse(token));

            req['user'] = user;

            next();
        } catch(error) {
            return res.status(401).json({ message: 'Failed to authenticate user'});
        }
    }
}