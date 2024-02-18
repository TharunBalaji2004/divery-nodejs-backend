import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import {Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    authenticated?: boolean;
}

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || "";

const createToken = (user: any) => {
    const accessToken = sign({ name: user.name, email: user.email, role: user.role }, jwtSecret);
    return accessToken;
}

const validateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['cookie'];
    const accessToken = authHeader && authHeader.split('=')[1];

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }

    try {
        const validToken = verify(accessToken, jwtSecret);

        if (validToken) {
            req.authenticated = true;
            return next();
        }

    } catch (err: any) {
        return res.status(401).json({
            error: true,
            message: "Invalid token"
        });
    }
}

export { createToken, validateToken };
