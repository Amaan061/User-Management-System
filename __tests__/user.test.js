import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';

describe('User Endpoints', () => {
    let accessToken;
    let user;

    beforeEach(async () => {
        // Create a test user
        user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        // Login to get tokens
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123'
            });

        accessToken = loginRes.headers['set-cookie']
            .find(cookie => cookie.includes('accessToken'))
            .split(';')[0]
            .split('=')[1];
    });

    describe('GET /api/v1/user/profile', () => {
        it('should get user profile with valid token', async () => {
            const res = await request(app)
                .get('/api/v1/user/profile')
                .set('Cookie', [`accessToken=${accessToken}`]);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('john@example.com');
            expect(res.body).not.toHaveProperty('password');
        });

        it('should not get profile without token', async () => {
            const res = await request(app)
                .get('/api/v1/user/profile');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Not authorized, no token');
        });
    });

    describe('PUT /api/v1/user/profile', () => {
        it('should update user profile', async () => {
            const res = await request(app)
                .put('/api/v1/user/profile')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send({
                    firstName: 'Johnny',
                    lastName: 'Updated',
                    email: 'johnny@example.com'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.firstName).toBe('Johnny');
            expect(res.body.lastName).toBe('Updated');
            expect(res.body.email).toBe('johnny@example.com');
        });

        it('should update password', async () => {
            const res = await request(app)
                .put('/api/v1/user/profile')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send({
                    password: 'newpassword123'
                });

            expect(res.statusCode).toBe(200);

            // Try logging in with new password
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'newpassword123'
                });

            expect(loginRes.statusCode).toBe(200);
        });

        it('should not update profile without token', async () => {
            const res = await request(app)
                .put('/api/v1/user/profile')
                .send({
                    firstName: 'Johnny'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Not authorized, no token');
        });
    });
}); 