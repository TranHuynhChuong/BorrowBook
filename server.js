/* eslint-disable no-undef */
const app = require('./app');
const config = require('./app/config');

const { connectToDatabase, handleProcessEvents } = require('./app/utils/mongodb_util');

async function startServer() {
    try {
        handleProcessEvents(); // Thiết lập các sự kiện kết thúc
        await connectToDatabase();
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
