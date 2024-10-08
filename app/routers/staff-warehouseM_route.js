const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff_controller');
const BookController = require('../controllers/book_controller');

router.post('/', StaffController.findPublisher); //Tìm kiếm nhà xuất bản theo tên, mã, nếu trống mặc định tìm tất cả /
router.post('/add', StaffController.createPublisher); //Thêm 1 nhà xuất bản /
router.get('/:id', StaffController.findOnePublisher); //Xem chi tiết 1 nhà xuất bản /
router.put('/:id', StaffController.updatePublisher); //Cập nhật 1 nhà xuất bản /
router.delete('/:id', StaffController.deletePublisher); //Xóa 1 nhà xuất bản /

router.post('/', BookController.findBookByFilter); //Tìm kiếm sách theo từ khóa /
router.post('/add', BookController.createBook); //Thêm 1 sách /
router.get('/:id', BookController.findOneBook); //Xem chi tiết 1 sách / /
router.delete('/:id', BookController.deleteBook); //Xóa 1 sách /

module.exports = router;
