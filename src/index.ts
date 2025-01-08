import express, { Request, Response } from "express";
import prisma from "./prisma";
import morgan from 'morgan'
import authRoutes from './routes/auth.routes'
import { ApiError } from "./helper/ApiError";
import { ResponseUtil } from "./utils/response";
import { globalErrorHandler } from "./helper/gloabalErrorhandler";
import { logger } from "./config/logger";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.use(
    morgan("combined", {
        stream: {
            write: (message: any) => logger.info(message.trim()),
        },
    })
);

app.set('NODE_ENV', 'development')

app.use('/auth', authRoutes);

app.all('*', (req, res, next) => {
    return next(new ApiError('Route not found', ResponseUtil.NOT_FOUND))
})

app.use(globalErrorHandler);
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
