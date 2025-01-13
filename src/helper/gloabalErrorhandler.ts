import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";
import { ResponseUtil } from "../utils/response";
import { error } from "console";
import { logger } from "../config/logger";

export const globalErrorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (process.env.NODE_ENV !== 'test') logger.error({ error: (<any>err).error, stack: err.stack });

    if (err instanceof ApiError) {
        res.status(err.statusCode || ResponseUtil.BAD_REQUEST).json({
            success: false,
            message: err.message,
            error: err.error,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
        return
    }

    res.status(ResponseUtil.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
