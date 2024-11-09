const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && 
                    allowedTypes.test(file.mimetype);
    cb(null, isValid);
};


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

module.exports = upload;
