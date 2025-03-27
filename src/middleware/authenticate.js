import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    try {
        let accessToken;
        
        // Check for access token in cookies first
        accessToken = req.cookies.accessToken;
        console.log("access token is",accessToken);
    
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

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

export { authenticate, authorize }; 