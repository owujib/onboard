import express, { } from 'express'
import morgan from 'morgan'
import { ApiError } from './helper/ApiError'
import { ResponseUtil } from './utils/response'
import prisma from './prisma'
import authRoutes from './routes/auth.routes'
import { logger } from "./config/logger";
import { globalErrorHandler } from "./helper/gloabalErrorhandler";


const app = express();

app.set('PORT', process.env.PORT || 3000)
app.use(express.json());

app.use(
    morgan("combined", {
        stream: {
            write: (message: any) => process.env.NODE_ENV !== 'test' && logger.info(message.trim()),
        },
    })
);

app.use('/api/auth', authRoutes);

app.all('*', (req, res, next) => {
    return next(new ApiError('Route not found', ResponseUtil.NOT_FOUND))
})

app.use(globalErrorHandler);

export default app
