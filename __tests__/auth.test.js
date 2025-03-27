import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';

describe('Authentication Endpoints', () => {
    describe('POST /api/v1/auth/signup', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('john@example.com');
            expect(res.body).not.toHaveProperty('password');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should not create a user with existing email', async () => {
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('john@example.com');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });
    });

    describe('POST /api/v1/auth/refresh-token', () => {
        let refreshToken;

        beforeEach(async () => {
            const user = await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            });

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                });

            refreshToken = loginRes.headers['set-cookie']
                .find(cookie => cookie.includes('refreshToken'))
                .split(';')[0]
                .split('=')[1];
        });

        it('should refresh access token with valid refresh token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/refresh-token')
                .set('Cookie', [`refreshToken=${refreshToken}`]);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Access token refreshed successfully');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should not refresh token without refresh token cookie', async () => {
            const res = await request(app)
                .post('/api/v1/auth/refresh-token');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'No refresh token');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        let refreshToken;

        beforeEach(async () => {
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                });

            refreshToken = loginRes.headers['set-cookie']
                .find(cookie => cookie.includes('refreshToken'))
                .split(';')[0]
                .split('=')[1];
        });

        it('should logout successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/logout')
                .set('Cookie', [`refreshToken=${refreshToken}`]);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged out successfully');
            
            // Verify cookies are cleared
            expect(res.headers['set-cookie']).toBeDefined();
            expect(res.headers['set-cookie'][0]).toMatch(/accessToken=;/);
            expect(res.headers['set-cookie'][1]).toMatch(/refreshToken=;/);
        });

        it('should handle logout without refresh token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/logout');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'No refresh token');
        });
    });
}); 