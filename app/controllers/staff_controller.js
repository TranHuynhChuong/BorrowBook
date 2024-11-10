/* eslint-disable no-unused-vars */
const createHttpError = require('http-errors');
const Staff = require('../models/staff_model');
const BorrowLog = require('../models/borrowLog_model');
const Book = require('../models/book_model');
const User = require('../models/user_model');

exports.createUser = async (req, res, next) => {
    try {
        const newStaff = new Staff(req.body);
        await newStaff.save();
        const newStaffSeq = Staff.staff_seq;
        const MSNV = `S${newStaffSeq.toString().padStart(4, '0')}`;
        await Staff.findByIdAndUpdate(newStaffSeq._id, { MSNV: MSNV });

        res.status(201).json({ message: 'Thêm mới thành công', staff: newStaff });
    } catch (error) {
        console.log(error);
        next(createHttpError.InternalServerError('Thêm mới thất bại'));
    }
};


exports.findUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const keyword = req.query.search;
        
        if (id) {
            const staff = await Staff.findById(id).select('-Password').exec();
            return res.json(staff);
        }

        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            
            const staffs = await Staff.find({
                $or: [
                    { SoDienThoai: regex },
                    { MSNV: regex },
                    { HoTenNV: regex }
                ]
            }).select('-Password').exec();
            return res.json(staffs);
        }
        const staffs = await Staff.find({}).select('-Password').exec();
        return res.json(staffs);
    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

// Xóa tài khoản theo ID User
exports.deleteUser = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (staff.ChuVu === 'Admin') {
            res.json();
        }
        const document = await Staff.findByIdAndDelete(req.params.id).exec();
        if (!document) {
            return next(createHttpError.NotFound('Không tìm thấy nhân viên'));
        }
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        next(
            createHttpError.InternalServerError('Xóa không thành công')
        );
    }
};

// Cập nhật thông tin tài khoản User
exports.updateUser = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        Object.assign(staff, req.body);
        await staff.save();

        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        next(
            createHttpError.InternalServerError('Cập nhật thất bại')
        );
    }
};


exports.profile = async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Cập nhật thất bại'
            )
        );
    }
};

// Cập nhật hồ sơ người dùng
exports.profileUpdate = async (req, res, next) => {
    try {
        const update = req.body;
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.user.user._id,
            update,
            { new: true }
        ).exec();
        if (!updatedStaff) {
            return next(createHttpError.NotFound('Không tìm thấy nhân viên'));
        }
        res.json(updatedStaff);
    } catch (error) {
        next(
            createHttpError.InternalServerError('Cập nhật thất bại')
        );
    }
};


exports.updateBorrowLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { TrangThai, NgayTra } = req.body; 

        // Tìm phiếu mượn theo ID
        const borrowLog = await BorrowLog.findById(id);
        
        if (!borrowLog) {
            return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        }

        // Nếu trạng thái là "trả", cập nhật số lượng sách
        if (TrangThai === 'Tra') {
            // Tìm sách tương ứng
            const book = await Book.findById(borrowLog.ID_Sach);
            if (book) {
                book.SoLuongHienTai += 1;
                await book.save(); 
            } else {
                return res.status(404).json({ message: "Không tìm thấy sách tương ứng" });
            }
        }

        // Cập nhật trạng thái phiếu mượn
        borrowLog.TrangThai = TrangThai;
        borrowLog.NgayTra = NgayTra;
        await borrowLog.save(); 


        return res.json({
            _id: borrowLog._id,
            ID_DocGia: borrowLog.ID_DocGia,
            ID_Sach: borrowLog.ID_Sach,
            NgayMuon: borrowLog.NgayMuon,
            NgayTra: borrowLog.NgayTra,
            TrangThai: borrowLog.TrangThai
        });
    } catch (error) {
        next(createHttpError.InternalServerError('Failed to update borrow log'));
    }
};

exports.deleteBorrowLog = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Tìm phiếu mượn theo ID
        const borrowLog = await BorrowLog.findById(id);

        if (!borrowLog) {
            return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        }

        // Tìm sách tương ứng
        const book = await Book.findById(borrowLog.ID_Sach);
        if (book) {
            if (borrowLog.TrangThai !== 'Tra') {
                book.SoLuongHienTai += 1;
                await book.save();  
            }
        } else {
            return res.status(404).json({ message: "Không tìm thấy sách tương ứng" });
        }

        // Xóa phiếu mượn
        await BorrowLog.findByIdAndDelete(id);

        return res.json({ message: "Phiếu mượn đã được xóa thành công" });
    } catch (error) {
        next(createHttpError.InternalServerError('Failed to delete borrow log'));
    }
};
