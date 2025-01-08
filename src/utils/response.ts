import { Response } from "express";
import { ValidationError } from "joi";

export class ResponseUtil {

    static BAD_REQUEST = 400
    static CREATED = 201
    static OK = 200
    static NOT_FOUND = 404
    static UNPROCESSABLE_ENTITY = 422
    static INTERNAL_SERVER_ERROR = 500
    static FORBIDDEN = 500
    static UNAUTHORIZED = 401

    static sendResponse(
        res: Response,
        success: boolean,
        message: string,
        data: any = null,
        status: number = 200
    ) {
        return res.status(status).json({ success, message, data });
    }

    static sendCreateResponse(
        res: Response,
        data: any = null,
        message: string = "Data successfully created"
    ) {
        return ResponseUtil.sendResponse(res, true, message, data, 201);
    }

    static sendSuccessResponse(
        res: Response,
        data: any = null,
        message: string = "Data successfully retrieved",
        status: number = 200
    ) {
        return ResponseUtil.sendResponse(res, true, message, data, status);
    }
}