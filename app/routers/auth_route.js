const router = require('express').Router();
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { registerValidator } = require('../utils/validator_util');
const authController = require('../controllers/auth_controller');

router.get(
    '/login',
    ensureLoggedOut({ redirectTo: '/' }),
    authController.getLogin
); //Đi tới trang đăng nhập

router.post(
    '/login',
    ensureLoggedOut({ redirectTo: '/' }),
    authController.postLogin
); //Đăng nhập

router.get(
    '/register',
    ensureLoggedOut({ redirectTo: '/' }),
    authController.getRegister
); //Đi tới trang đăng ký

router.post(
    '/register',
    ensureLoggedOut({ redirectTo: '/' }),
    registerValidator,
    authController.postRegister
); //Đăng ký

router.get(
    '/logout',
    ensureLoggedIn({ redirectTo: '/' }),
    authController.logout
); // Đăng xuất

router.get('/', (req, res) => {
    res.json({ message: 'auth page' });
});

module.exports = router;
