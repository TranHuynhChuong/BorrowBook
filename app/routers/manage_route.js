const router = require('express').Router();
const BookController = require('../controllers/book_controller');
const upload = require('../utils/multerConfig'); // Import cấu hình multer



router.put('/book/:id', upload.single('file'), BookController.updateBook);
router.delete('/book/:id', BookController.deleteBook);
router.post('/book/add', upload.single('file'), BookController.createBook);


const CategoryController = require('../controllers/category_controller');

// Quản lý danh mục *

router.put('/category/:id', CategoryController.updateCategory);
router.delete('/category/:id', CategoryController.deleteCategory);
router.post('/category/add', CategoryController.createCategory); 


const PublisherController = require('../controllers/publisher_controller');
// Quản lý nhà xuất bản
router.get('/publisher/:id?', PublisherController.findPublisher);
router.put('/publisher/:id', PublisherController.updatePublisher);
router.delete('/publisher/:id', PublisherController.deletePublisher);
router.post('/publisher/add', PublisherController.createPublisher);

const StaffController = require('../controllers/staff_controller');

router.get('/staff/:id?', StaffController.findUser);
router.post('/staff/add', StaffController.createUser);
router.put('/staff/:id', StaffController.updateUser);
router.delete('/staff/:id', StaffController.deleteUser); 


router.put('/borrow/:id', StaffController.updateBorrowLog);
router.delete('/borrow/:id', StaffController.deleteBorrowLog);


module.exports = router;