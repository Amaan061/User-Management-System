import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5,  // Minimum number of connections alive at all times in the pool
            serverSelectionTimeoutMS: 5000, // Timeout if MongoDB server is unavailable  
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            
            waitQueueTimeoutMS: 10000 // If a connection waits in the queue for more than 10 seconds, it fails.
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
