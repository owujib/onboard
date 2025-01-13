import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'test') {

    const { PrismaClient: TestPrismaClient } = require('../prisma/generated-test');
    prisma = new TestPrismaClient();
} else {
    prisma = new PrismaClient();
}

export default prisma;