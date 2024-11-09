const mongoose = require('mongoose');
const config = require('../config');
const { GridFSBucket } = require('mongodb');

let avatarBucket;
let coverBucket;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(config.db.uri);
            console.log('MongoDB connected.');
            const db = mongoose.connection.db;
            avatarBucket = new GridFSBucket(db, { bucketName: 'avatar' });
            coverBucket = new GridFSBucket(db, { bucketName: 'cover' });
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            process.exit(1);
        }
    }
};

const getAvatarBucket = () => {
    if (!avatarBucket) {
        throw new Error('Avatar bucket is not initialized');
    }
    return avatarBucket;
};

const getCoverBucket = () => {
    if (!coverBucket) {
        throw new Error('Cover bucket is not initialized');
    }
    return coverBucket;
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
        await disconnectFromDatabase();
        console.log(
            'Mongoose connection closed due to application termination.'
        );
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await disconnectFromDatabase();
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
    getAvatarBucket,
    getCoverBucket,
};
