import { NextFunction, Request, Response } from "express";
import { validate } from "../../utils/validator";
import { ResponseUtil } from "../../utils/response";
import prisma from "../../prisma";
import { forgotPasswordSchema, loginSchema, recoverPasswordSchema, registerSchema, resendAuthCodeSchema } from "../../validation/auth";
import { comparePassword, generateExpiry, generateToken, hashPassword } from "../../utils/authUtils";
import { ApiError } from "../../helper/ApiError";
import { sendEmail } from "../../utils/email";



class AuthController {
    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(registerSchema, req.body);
            const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
            if (existingUser) return next(ApiError.notFound('Email already exists'));

            const hashedPassword = await hashPassword(data.password);
            const user = await prisma.user.create({
                data: { name: data.name, email: data.email, password: hashedPassword },
            });
            const { password: _, authCode: __, authExpiry: ___, authExpiryMs: ____, ...userWithoutPassword } = user;
            ResponseUtil.sendCreateResponse(res, { user: userWithoutPassword }, "User registered successfully")
            return
        } catch (error) {
            return next(error)
        }
    }
    public async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(loginSchema, req.body);

            const user = await prisma.user.findUnique({ where: { email: data.email } });
            if (!user || !(await comparePassword(data.password, user.password))) {
                return next(ApiError.badRequest("Invalid email or password"));
            }
            const token = generateToken({ id: user.id });
            ResponseUtil.sendSuccessResponse(res, { accessToken: token }, "Login successful")
            return
        } catch (error) {
            next(error)
        }
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(forgotPasswordSchema, req.body);
            const user = await prisma.user.findUnique({ where: { email: data.email } });
            if (!user) return next(ApiError.badRequest("Something went wrong please check your email and try again"));

            const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const authExpiry = generateExpiry();

            console.log({
                where: { id: user.id },
                data: {
                    authCode: authCode,
                    authExpiry: authExpiry,
                    authExpiryMs: authExpiry.getTime()
                },
            })

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    authCode: authCode,
                    authExpiry: authExpiry,
                    authExpiryMs: authExpiry.getTime()
                },
            });

            await sendEmail(data.email, "Password Reset Code", `Your code is: ${authCode}`);
            ResponseUtil.sendSuccessResponse(res, "Password reset code sent")
            return
        } catch (error) {
            return next(error)
        }
    }

    public async recoverPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(recoverPasswordSchema, req.body);
            const user = await prisma.user.findUnique({ where: { email: data.email } });

            if (!user || user.authCode !== data.authCode || user.authExpiryMs! < new Date().getTime()) {
                return next(ApiError.badRequest("Invalid or expired code"))
            }

            const hashedPassword = await hashPassword(data.newPassword);
            await prisma.user.update({
                where: { email: data.email },
                data: { password: hashedPassword, authCode: null, authExpiry: null },
            });

            ResponseUtil.sendSuccessResponse(res, "Password reset successfully")
            return
        } catch (error) {
            return next(error)
        }
    }
    public async resendAuthCode(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(resendAuthCodeSchema, req.body);

            const user = await prisma.user.findUnique({ where: { email: data.email } });
            if (!user) return next(ApiError.notFound("User not found"))

            const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const authExpiry = generateExpiry();

            await prisma.user.update({
                where: { email: data.email },
                data: { authCode, authExpiry },
            });

            await sendEmail(data.email, "Verification Code", `Your code is: ${authCode}`);
            ResponseUtil.sendSuccessResponse(res, "Verification code resent")
            return
        } catch (error) {
            return next(error)
        }
    }
}

export default new AuthController()


