const express = require('express');
const BookController = require('../controllers/book_controller');

const router = express.Router();

router.get('/image/name/:id', BookController.getBookImageName);
router.get('/image/:id', BookController.getBookImage);
router.get('/:id?', BookController.findBook);
router.get('/bookBycategory/:id', BookController.findBookByCategory);


module.exports = router;
