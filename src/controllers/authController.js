import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { setTokenCookies } from '../utils/cookieUtils.js';


export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        // Generate tokens
        const tokens = await user.generateTokens();

        // Set cookies
        setTokenCookies(res, tokens);

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate tokens
        const tokens = await user.generateTokens();

        // Set cookies
        setTokenCookies(res, tokens);

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if refresh token exists in user's refreshTokens array
        const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
        if (!tokenExists) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const tokens = await user.generateTokens();

        // Remove old refresh token
        await user.removeRefreshToken(refreshToken);

        // Set cookies
        setTokenCookies(res, tokens);

        res.json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};


export const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                await user.removeRefreshToken(refreshToken);
            }
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 