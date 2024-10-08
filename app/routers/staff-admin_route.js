const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff_controller');

router.post('/', StaffController.findUser); //Tìm kiếm nhân viên theo mã, họ tên, chức vụ mặc định trống là tìm tất cả /
router.post('/add', StaffController.createUser); //Thêm 1 nhân viên /
router.get('/:id', StaffController.findOneUser); //Xem chi tiết 1 nhân viên /
router.put('/:id', StaffController.updateUser); //Cập nhật 1 nhân viên /
router.delete('/:id', StaffController.deleteUser); //Xóa 1 nhân viên /

module.exports = router;
