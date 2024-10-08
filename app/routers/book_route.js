const express = require('express');
const BookController = require('../controllers/book_controller');

const BorrowLogController = require('../controllers/staff_controller');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/search', BookController.findBookByFilter); //Tìm kiếm theo từ khóa
router.get('/:id', BookController.findOneBook); //Xem chi tiết 1 sách

router.post(
    '/:id',
    ensureLoggedIn({ redirectTo: '/auth/login' }),
    BorrowLogController.createBorrowLog
); // Đăng ký mượn sách

module.exports = router;
