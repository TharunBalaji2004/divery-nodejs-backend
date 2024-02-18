import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ApiResponse } from "../../utils/api.response";
import prisma from "../../utils/prisma";
import { createToken } from "../../utils/jwt.init";

const userExists = async (email: string, role: string) => {
    if (role === "inventory") {
        const user = await prisma.inventoryAgent.findUnique({
            where: {
                email: email
            }
        });
        return user;
    } else if (role === "delivery") {
        const user = await prisma.deliveryAgent.findUnique({
            where: {
                email: email
            }
        });
        return user;
    }
}

export const registerController = async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
) => {
    const { name, email, password, role } = req.body;

    const user = await userExists(email, role);

    if (user) {
        return res.status(200).json({
            success: false,
            message: "Email Already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        if (role === "inventory") {
            const newUser = await prisma.inventoryAgent.create({
                data: {
                    name: name,
                    email: email,
                    password: hashPassword
                }
            });
            console.log('Inventory Agent created successfully');
            return res.status(200).json({
                success: true,
                message: "Inventory Agent created successfully",
            });
        } else if (role === "delivery") {
            const newUser = await prisma.deliveryAgent.create({
                data: {
                    name: name,
                    email: email,
                    password: hashPassword
                }
            });
            console.log('Delivery Agent created successfully');
            return res.status(200).json({
                success: true,
                message: "Delivery Agent created successfully",
            });
        }
    } catch (err: any) {
        console.log(err.message);
        return res.status(200).json({
            success: false,
            message: "Error occurred: " + err
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password, role } = req.body;
    const user = await userExists(email, role);

    if (!user) {
        return res.status(200).json({
            success: false,
            message: "Email doesn't exist",
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(200).json({
            error: true,
            message: "Incorrect password"
        });
    }

    try {
        const userData = {
            name: user.name,
            email: user.email,
            role: role
        };

        const accessToken = createToken(userData);

        res.cookie("access-token", accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            result: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(200).json({
            success: false,
            message: "Error occurred: " + err
        });
    }
};
