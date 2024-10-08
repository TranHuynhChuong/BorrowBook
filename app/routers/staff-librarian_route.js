const express = require('express');
const router = express.Router();
const BorrowLogController = require('../controllers/staff_controller');

router.post('/', BorrowLogController.findBorrowLog); //Tìm phiếu mượn của 1 độc giả (với tùy chọn trạng thái tương ứng) /
router.post('/add', BorrowLogController.createBorrowLog); //Thêm 1 phiếu mượn /
router.get('/:id', BorrowLogController.findOneBorrowLog); //Xem chi tiết 1 phiếu mượn /
router.put('/:id', BorrowLogController.updateBorrowLog); // Cập nhật 1 phiếu mượn /
router.delete('/:id', BorrowLogController.deleteBorrowLog); // Xóa 1 phiếu mượn /

module.exports = router;
