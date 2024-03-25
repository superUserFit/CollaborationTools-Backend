import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1] || req.query.token || req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        try {
            const user = this.jwtService.verify(token);

            req['user'] = user;
            next();
        } catch(error) {
            return res.status(401).json({ message: 'Failed to authenticate user'});
        }
    }
}