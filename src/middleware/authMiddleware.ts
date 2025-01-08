import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/authUtils";
import { ApiError } from "../helper/ApiError";
import prisma from "../prisma";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return next(ApiError.unauthorized("Unauthorized: No token provided"));


        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return next(ApiError.unauthorized("Unauthorized: User not found"));
        }

        (req as any).user = user;

        return next();
    } catch (error) {
        return next(ApiError.unauthorized("Unauthorized: Invalid token"));
    }
};
