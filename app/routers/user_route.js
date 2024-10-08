const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');

router.get('/setting', (req, res) => {
    res.json({ message: 'User setting page' });
});

router.get('/profile', UserController.profile); //Xem thông tin cá nhân
router.put('/profile', UserController.profileUpdate); //Cập nhật thông tin cá nhân

router.get('/account', UserController.sendOTP); //Xem thông tin tài khoản
router.post('/account', UserController.getAccount); //Cập nhật thông tin tài khoản

router.get('/borrow-logs', UserController.getAllBorrowLog); //Danh sách phiếu mượn
router.get('/favorites', UserController.getAllFavorite); //Danh sách yêu thích
module.exports = router;
