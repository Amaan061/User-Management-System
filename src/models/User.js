import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['farm_admin', 'farm_manager', 'farm_technician', 'user'],
        default: 'user'
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate tokens
userSchema.methods.generateToken = async function() {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets not configured in environment variables');
    }
    
    // Generate access token
    const accessToken = jwt.sign(
        { id: this._id, role: this.role, email: this.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Save refresh token to user document
    this.refreshToken = refreshToken;
    await this.save();

    return { accessToken, refreshToken };
};

const User = mongoose.model('User', userSchema);

export default User;
