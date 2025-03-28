import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 export const authenticate = async (req, res, next) => {
    try {
        let accessToken;
        
        // Check for access token in cookies first
        accessToken = req.cookies.accessToken;
        
    
        if (!accessToken) {
            return res.status(401).json({ message: 'Not authorized, no access token' });
        }
        
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log("Token verification error");
            // If access token is expired, then you have to refresh the token
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Access token expired',
                    shouldRefresh: true 
                });
            }

            // Clear invalid token from cookies
            res.clearCookie('accessToken');
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } catch (error) {
        console.log("Authentication error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};





