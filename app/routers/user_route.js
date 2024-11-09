const router = require('express').Router();
const upload = require('../utils/multerConfig');

const UserController = require('../controllers/user_controller');

router.post('/borrow', UserController.RegisterBorrow);
router.get('/borrow/:id?', UserController.getBorrowLog);
router.get('/avatar/:id', UserController.getAvatar);
router.put('/profile/:id', upload.single('file'), UserController.profileUpdate);
router.get('/verify', UserController.getUser);
module.exports = router;
