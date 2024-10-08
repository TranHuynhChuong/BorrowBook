/* eslint-disable no-unused-vars */
const createHttpError = require('http-errors');
const Staff = require('../models/staff_model');
const Publisher = require('../models/publisher_model');
const BorrowLog = require('../models/borrowLog_model');
const Book = require('../models/book_model');
const User = require('../models/user_model');
//<<manage-users
//
// Tạo tài khoản mới User
exports.createUser = async (req, res, next) => {
    try {
        const { MSNV, Password } = req.body;
        const doesExist = await Staff.findOne({ MSNV });
        if (doesExist) {
            return next(createHttpError.Conflict('MSNV already exists'));
        }
        const staff = new Staff(req.body);
        await staff.save();

        res.status(201).json({
            MSNV: staff.MSNV,
            HoTenNV: staff.HoTenNV,
            DiaChi: staff.DiaChi,
            SoDienThoai: staff.SoDienThoai,
            ChucVu: staff.ChucVu,
            Password: Password,
        });
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to create staff member')
        );
    }
};

// Tìm tài khoản theo ID User
exports.findOneUser = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id).exec();
        if (!staff) {
            return next(createHttpError.NotFound('Staff member not found'));
        }
        res.json(staff);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve staff member'
            )
        );
    }
};

// Tìm tất cả tài khoản User (mặc đinh), tìm theo họ tên, msnv, chức vụ
exports.findUser = async (req, res, next) => {
    try {
        const keyword = req.body.keyword;
        if (keyword === '') {
            const documents = await Staff.find({}).exec();
            return res.json(documents);
        }
        const filter = {
            $or: [
                { MSNV: { $regex: keyword, $options: 'i' } },
                { HoTenNV: { $regex: keyword, $options: 'i' } },
                { ChucVu: { $regex: keyword, $options: 'i' } },
            ],
        };

        const documents = await Staff.find(filter).exec();

        if (documents.length === 0) {
            return next(
                createHttpError(
                    404,
                    'Không tìm thấy nhân viên phù hợp với từ khóa'
                )
            );
        }

        return res.json(documents);
    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

// Xóa tài khoản theo ID User
exports.deleteUser = async (req, res, next) => {
    try {
        const document = await Staff.findByIdAndDelete(req.params.id).exec();
        if (!document) {
            return next(createHttpError.NotFound('Staff member not found'));
        }
        res.json({ message: 'Staff member successfully deleted' });
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to delete staff member')
        );
    }
};

// Cập nhật thông tin tài khoản User
exports.updateUser = async (req, res, next) => {
    try {
        const document = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Staff member not found'));
        }
        res.json({ message: 'Staff member successfully updated' });
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to update staff member')
        );
    }
};

//
//manage-users>>

//profile>>
//
// Lấy thông tin hồ sơ người dùng
exports.profile = async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve user profile'
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
            return next(createHttpError.NotFound('Staff member not found'));
        }
        res.json(updatedStaff);
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to update user profile')
        );
    }
};

// Cập nhật mật khẩu
exports.updatePassword = async (req, res, next) => {
    try {
        const staff = req.user.user;
        const { oldPassword, newPassword } = req.body;

        const isMatch = await staff.isValidPassword(oldPassword);
        if (!isMatch) {
            return next(
                createHttpError.Unauthorized('Old password is incorrect')
            );
        }

        staff.Password = newPassword;
        await staff.save();
        res.json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        next(createHttpError.InternalServerError('Failed to update password'));
    }
};
//
//profile>>

//<<manage-publishers
//
// Tạo  Publisher mới
exports.createPublisher = async (req, res, next) => {
    try {
        const { MaNXB } = req.body;
        const doesExist = await Publisher.findOne({ MaNXB });
        if (doesExist) {
            return next(createHttpError.Conflict('MaNXB already exists'));
        }
        const publisher = new Publisher(req.body);
        const savedPublisher = await publisher.save();

        // Trả về phản hồi thành công với mã trạng thái 201 Created
        res.status(201).json({
            publisher: savedPublisher,
        });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to create publisher member'
            )
        );
    }
};

// Tìm Publisher theo ID
exports.findOnePublisher = async (req, res, next) => {
    try {
        const publisher = await Publisher.findById(req.params.id).exec();
        if (!publisher) {
            return next(createHttpError.NotFound('Publisher member not found'));
        }
        res.json(publisher);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve publisher member'
            )
        );
    }
};

// Tìm tất cả Publisher
exports.findAllPublisher = async (req, res, next) => {
    try {
        const publisherMembers = await Publisher.find({}).exec();
        res.json(publisherMembers);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve publisher members'
            )
        );
    }
};
// Tìm Nhà xuất bản bằng từ khóa
exports.findPublisher = async (req, res, next) => {
    try {
        const keyword = req.body.keyword; // Từ khóa người dùng nhập vào
        if (keyword === '') {
            const documents = await Publisher.find({}).exec();
            return res.json(documents);
        }

        const filter = {
            $or: [
                { MaNXB: { $regex: keyword, $options: 'i' } },
                { TenNXB: { $regex: keyword, $options: 'i' } },
            ],
        };

        // Tìm kiếm Nhà xuất bản dựa trên filter
        const documents = await Publisher.find(filter).exec();

        if (documents.length === 0) {
            return next(
                createHttpError(
                    404,
                    'Không tìm thấy Nhà xuất bản phù hợp với từ khóa'
                )
            );
        }

        return res.json(documents);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
};

// Xóa Publisher theo ID
exports.deletePublisher = async (req, res, next) => {
    try {
        const document = await Publisher.findByIdAndDelete(
            req.params.id
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Publisher member not found'));
        }
        res.json({ message: 'Publisher member successfully deleted' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to delete publisher member'
            )
        );
    }
};

// Cập nhật thông tin Publisher
exports.updatePublisher = async (req, res, next) => {
    try {
        const document = await Publisher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Publisher member not found'));
        }
        res.json({ message: 'Publisher member successfully updated' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to update publisher member'
            )
        );
    }
};
//
//manage-publishers>>

exports.createBorrowLog = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).exec();
        if (!book) {
            return next(createHttpError(404, 'Không tìm thấy sách'));
        }
        const bookId = book._id;
        const userId = req.user.user._id;

        const nowInVN = new Date();
        const vnOffset = 7 * 60 * 60 * 1000; // 7 giờ = 7 * 60 * 60 * 1000 ms
        const nowInVNAdjusted = new Date(nowInVN.getTime() + vnOffset);

        const newBorrowLog = new BorrowLog({
            ID_DocGia: userId, // ID người dùng (độc giả)
            ID_Sach: bookId, // ID sách
            NgayMuon: nowInVNAdjusted,
        });

        await newBorrowLog.save();
        console.log(newBorrowLog);
        res.status(201).json({
            message: 'Phiếu mượn đã được tạo thành công',
            borrowLog: newBorrowLog,
        });
    } catch (error) {
        console.log(error);
        return next(
            createHttpError(500, 'Đã xảy ra lỗi khi tạo phiếu mượn sách')
        );
    }
};

exports.findBorrowLog = async (req, res, next) => {
    try {
        const user = await User.findOne({ MaDocGia: req.body.MaDocGia });
        if (!user) {
            return next(createHttpError(500, 'Không tìm thấy người dùng'));
        }
        const status = req.body.TrangThai;
        const borrowLogs = await BorrowLog.find({
            ID_DocGia: user._id,
            TrangThai: status,
        });
        if (borrowLogs.length === 0) {
            return next(createHttpError(500, 'Không tìm thấy phiếu mượn'));
        }
        res.status(201).json(borrowLogs);
    } catch (error) {
        console.log(error);
        next(createHttpError(500, 'Không tìm thấy phiếu mượn'));
    }
};

exports.findOneBorrowLog = async (req, res, next) => {
    try {
        const document = await BorrowLog.findById(req.params.id).exec();

        if (!document) {
            return next(createHttpError(404, 'Phiếu mượn không được tìm thấy'));
        }
        return res.json(document);
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Lỗi khi truy xuất phiếu mượn với ID=${req.params.id}`,
                error
            )
        );
    }
};

exports.updateBorrowLog = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            createHttpError(400, 'Dữ liệu cập nhật không thể để trống')
        );
    }
    try {
        const document = await BorrowLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).exec();

        if (!document) {
            return next(createHttpError(404, 'Phiếu mượn không được tìm thấy'));
        }
        return res.json({
            message: 'Phiếu mượn đã được cập nhật thành công',
            document,
        });
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Không thể cập nhật Phiếu mượn với ID=${req.params.id}`,
                error
            )
        );
    }
};

exports.deleteBorrowLog = async (req, res, next) => {
    try {
        const document = await BorrowLog.findByIdAndDelete(
            req.params.id
        ).exec();

        if (!document) {
            return next(createHttpError(404, 'Phiếu mượn không được tìm thấy'));
        }
        return res.json({ message: 'Phiếu mượn đã được xóa thành công' });
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Không thể xóa Phiếu mượn với ID=${req.params.id}`,
                error
            )
        );
    }
};
