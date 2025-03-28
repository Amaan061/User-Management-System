import User from '../models/User.js';

//    Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken -__v');  // Exclude sensitive fields
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//     Update user role
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 