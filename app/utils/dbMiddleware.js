// file: ./app/middleware/dbMiddleware.js
const {
    connectToDatabase,
    disconnectFromDatabase,
} = require('../utils/mongodb_util');

const dbMiddleware = async (req, res, next) => {
    try {
        await connectToDatabase(); // Kết nối cơ sở dữ liệu
        res.on('finish', async () => {
            // Ngắt kết nối khi phản hồi đã được gửi
            await disconnectFromDatabase();
        });
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = dbMiddleware;
