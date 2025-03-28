import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5,  // Minimum number of connections in the pool
            serverSelectionTimeoutMS: 5000 // Timeout after 5s 
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB; 