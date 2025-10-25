import mongoose from 'mongoose';
import { config } from '../config/config.js';

const connectDB = async () => {
    try {
        // Remove deprecated options - they're now default in Mongoose 6+
        const conn = await mongoose.connect(config.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;