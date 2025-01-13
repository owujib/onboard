// import request from 'supertest';
// import app from '../src/app';

// app.set('NODE_ENV', 'test')

// describe('Authentication Tests', () => {
//     let token: string;

//     it('should return a token for valid login', async () => {
//         const response = await request(app)
//             .post('/api/auth/login')
//             .send({ username: 'testuser', password: 'password123' });

//         expect(response.status).toBe(200);
//         expect(response.body.token).toBeDefined();
//         token = response.body.token;
//     });

//     it('should return 401 for invalid login credentials', async () => {
//         const response = await request(app)
//             .post('/api/auth/login')
//             .send({ username: 'testuser', password: 'wrongpassword' });

//         expect(response.status).toBe(401);
//         expect(response.body.message).toBe('Invalid credentials');
//     });

//     it('should grant access to a protected route with a valid token', async () => {
//         const response = await request(app)
//             .get('/api/auth/protected')
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Access granted');
//     });

//     it('should deny access to a protected route without a token', async () => {
//         const response = await request(app).get('/auth/protected');

//         expect(response.status).toBe(401);
//         expect(response.body.message).toBe('Unauthorized');
//     });

//     it('should deny access to a protected route with an invalid token', async () => {
//         const response = await request(app)
//             .get('/auth/protected')
//             .set('Authorization', 'Bearer invalidtoken');

//         expect(response.status).toBe(401);
//         expect(response.body.message).toBe('Invalid token');
//     });
// });

import request from 'supertest';
import prisma from '../src/prisma'
import { sendEmail } from '../src/utils/email';
import app from '../src/app'
import { generateToken, hashPassword } from '../src/utils/authUtils';
jest.mock('../src/utils/email');

let token: string;

beforeAll(async () => {
    await prisma.$connect();

    await prisma.user.deleteMany();

    const hashedPassword = await hashPassword('password123');
    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
        },
    });
    token = generateToken({ id: user.id });
});

afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('Auth API Routes', () => {
    it('should create a user', async () => {
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'newpassword123',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.data.user.email).toBe('newuser@example.com');
    });
    it('should test for an non existing user', async () => {
        await request(app)
            .post('/api/auth/create-account')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'newpassword123',
            });

        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'newpassword123',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already exists');
    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        token = response.body.data.accessToken
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data.accessToken).toBe(token);
    });
    it('should test for invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123er',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });
    it('should test for invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@examples.com',
                password: 'password123er',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });


    it('should send password reset code on forgot password', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'test@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password reset code sent');
        expect(sendEmail).toHaveBeenCalled();
    });

    it('should recover password using valid reset code', async () => {
        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
        });

        const authCode = 'ABCD1234';
        await prisma.user.update({
            where: { email: 'test@example.com' },
            data: { authCode, authExpiryMs: Date.now() + 3600000 },
        });

        const response = await request(app)
            .post('/api/auth/recover-password')
            .send({
                email: 'test@example.com',
                authCode,
                newPassword: 'newpassword456',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password reset successfully');
    });

    it('should resend the authentication code', async () => {
        const response = await request(app)
            .post('/api/auth/resend-auth-code')
            .send({
                email: 'test@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Verification code resent');
        expect(sendEmail).toHaveBeenCalled();
    });

    it('should return user info for authenticated user', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);



        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Data successfully retrieved");
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.name).toBe("Test User");
    });
});