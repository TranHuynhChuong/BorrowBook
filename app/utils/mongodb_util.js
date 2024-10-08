const mongoose = require('mongoose');
const config = require('../config');

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(config.db.uri);
            console.log('MongoDB connected.');
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            process.exit(1);
        }
    }
};
async function disconnectFromDatabase() {
    if (mongoose.connection.readyState === 1) {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }
}

const handleProcessEvents = () => {
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log(
            'Mongoose connection closed due to application termination.'
        );
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await mongoose.connection.close();
        console.log(
            'Mongoose connection closed due to application termination.'
        );
        process.exit(0);
    });
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
    handleProcessEvents,
};
