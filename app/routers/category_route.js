const router = require('express').Router();
const CategoryController = require('../controllers/category_controller');

router.get('/:id?', CategoryController.findCategory);

module.exports = router;