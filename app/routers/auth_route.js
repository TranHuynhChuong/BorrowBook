const router = require('express').Router();
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { registerValidator } = require('../utils/validator_util');
const authController = require('../controllers/auth_controller');

router.get('/', (req, res) => {
    res.json({ message: 'auth page' });
});


router.post(
    '/login',
    ensureLoggedOut({ redirectTo: '/api/auth' }),
    authController.login
);


router.post(
    '/register',
    ensureLoggedOut({ redirectTo: '/api/auth' }),
    registerValidator,
    authController.register
);

router.get(
    '/logout',
    ensureLoggedIn({ redirectTo: '/api/auth' }),
    authController.logout
);

router.get('/checkloggedin', authController.checkLoggedin);




module.exports = router;
