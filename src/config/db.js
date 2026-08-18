const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('──────────────────────────────────────────');
        console.error('FATAL: MongoDB connection failed');
        console.error(`Reason: ${error.message}`);
        console.error('Check: MONGO_URI env var and Atlas Network Access (allow 0.0.0.0/0)');
        console.error('──────────────────────────────────────────');
        process.exit(1);
    }
};

module.exports = connectDB;
