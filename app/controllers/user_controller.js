/* eslint-disable no-unused-vars */
const BorrowLog = require('../models/borrowLog_model');
const User = require('../models/user_model');
const createHttpError = require('http-errors');
const Book = require('../models/book_model');
const { getAvatarBucket } = require('../utils/mongodb_util');
const mongoose = require('mongoose');
const dayjs = require('dayjs');

exports.RegisterBorrow = async (req, res, next) => {
    try {

        const { ID_DocGia, ID_Sach, NgayMuon } = req.body;
        const book = await Book.findById(ID_Sach);
        if (book) {
            if (book.SoLuongHienTai <= 0) {
                return res.json({mesage: "Sách hiện tại không có sẵn"});
            } else {
                book.SoLuongHienTai -= 1;
                await book.save();
            }
        } else {
            return res.status(404);
        }

        const existingBorrowLog = await BorrowLog.findOne({
            ID_DocGia,
            ID_Sach,
            NgayMuon: new Date(NgayMuon).setHours(0, 0, 0, 0)
        });

        if (existingBorrowLog) {
            return res.status(400).json({ message: "Sách đã được đăng ký mượn" });
        }

        const borrowLog = new BorrowLog(req.body);
        await borrowLog.save();
        
        return res.status(201).json({message: "Đăng ký thành công"});
    } catch (error) {
        console.log(error);
        next(createHttpError.InternalServerError('Failed to retrieve borrow logs'));
    }
};

exports.getBorrowLog = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const { id } = req.params; 
        const borrowLogQuery = {};

        // Kiểm tra xem id có phải là ID phiếu mượn hay ID độc giả
        if (id) {
            // Tìm log theo ID phiếu mượn
            const borrowLog = await BorrowLog.findById(id)
                .populate({ path: 'ID_DocGia', select: 'MaDocGia' })
                .populate({ path: 'ID_Sach', select: 'MaSach TenSach' })
                .populate({ path: 'ID_NV', select: 'MSNV' })
                .exec();

            // Nếu tìm thấy log theo ID phiếu mượn
            if (borrowLog) {
                const responseLog = {
                    _id: borrowLog._id,
                    ID_DocGia: borrowLog.ID_DocGia,
                    ID_Sach: borrowLog.ID_Sach,
                    NgayMuon: borrowLog.NgayMuon,
                    NgayTra: borrowLog.NgayTra,
                    TrangThai: borrowLog.TrangThai,
                    MaDocGia: borrowLog.ID_DocGia.MaDocGia,
                    MaSach: borrowLog.ID_Sach.MaSach,
                    TenSach: borrowLog.ID_Sach.TenSach,
                    MSNV: borrowLog.ID_NV ? borrowLog.ID_NV.MSNV : null
                };

                return res.json(responseLog);
            }

            // Nếu không tìm thấy log phiếu mượn, kiểm tra ID độc giả
            const user = await User.findById(id);
            if (user) {
                // Tìm tất cả các log của độc giả này
                borrowLogQuery.ID_DocGia = user._id;
            
                // Lấy danh sách các log mượn của độc giả
                const borrowLogs = await BorrowLog.find(borrowLogQuery)
                    .populate({ path: 'ID_DocGia', select: 'MaDocGia' })
                    .populate({ path: 'ID_Sach', select: 'MaSach TenSach' })
                    .populate({ path: 'ID_NV', select: 'MSNV' })
                    .exec();


                const modifiedLogs = borrowLogs.map(log => ({
                    _id: log._id,
                    ID_DocGia: log.ID_DocGia,
                    ID_Sach: log.ID_Sach,
                    NgayMuon: log.NgayMuon,
                    NgayTra: log.NgayTra,
                    TrangThai: log.TrangThai,
                    MaDocGia: log.ID_DocGia.MaDocGia,
                    MaSach: log.ID_Sach.MaSach,
                    TenSach: log.ID_Sach.TenSach,
                    MSNV: log.ID_NV ? log.ID_NV.MSNV : null
                }));


                return res.json(modifiedLogs);
            } else {
                return res.json([]);
            }
        }

        // Tìm kiếm theo mã độc giả nếu có tham số search
        if (search) {
            const users = await User.find({ MaDocGia: new RegExp(search, 'i') }).exec();
            if (users.length) {
                // Nếu tìm thấy người dùng, lấy ID_DocGia
                borrowLogQuery.ID_DocGia = { $in: users.map(user => user._id) }; // Sử dụng $in để tìm kiếm nhiều ID_DocGia
            } else {

                return res.json([]);
            }
        }

        if (status) {
            if (status === 'QuaHan') {
                const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();
                borrowLogQuery.NgayTra = null;
                borrowLogQuery.NgayMuon = { $lte: sevenDaysAgo };
            } else if (status !== 'TatCa') {
                borrowLogQuery.TrangThai = status;
            }
        }

        const borrowLogs = await BorrowLog.find(borrowLogQuery)
            .populate({ path: 'ID_DocGia', select: 'MaDocGia' })
            .populate({ path: 'ID_Sach', select: 'MaSach TenSach' })
            .populate({ path: 'ID_NV', select: 'MSNV' })
            .exec();


        const modifiedLogs = borrowLogs.map(log => ({
            _id: log._id,
            ID_DocGia: log.ID_DocGia,
            ID_Sach: log.ID_Sach,
            NgayMuon: log.NgayMuon,
            NgayTra: log.NgayTra,
            TrangThai: log.TrangThai,
            MaDocGia: log.ID_DocGia.MaDocGia,
            MaSach: log.ID_Sach.MaSach,
            TenSach: log.ID_Sach.TenSach,
            MSNV: log.ID_NV ? log.ID_NV.MSNV : null
        }));


        return res.json(modifiedLogs);
    } catch (error) {
        console.log(error)
        next(createHttpError.InternalServerError('Failed to retrieve borrow logs'));
    }
};




//profile>>

// Cập nhật hồ sơ người dùng
exports.profileUpdate = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createHttpError.InternalServerError());
        }

        const { MaDocGia, ...updatedData } = req.body;
        Object.assign(user, updatedData);

        if (req.file) {
            const avatarBucket = getAvatarBucket();
            if (user.avatar) {
                try {
                    const fileId = new mongoose.Types.ObjectId(user.avatar);
                    const fileExists = await avatarBucket.find({ _id: fileId }).toArray();
                    if (fileExists.length !== 0) {
                        await avatarBucket.delete(fileId);
                    }
                } catch (err) {
                    next(createHttpError.InternalServerError());
                }
            }

            const uploadStream = avatarBucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer); 
            uploadStream.on('finish', async () => {
                user.avatar = uploadStream.id; 
                await user.save();
                return res.status(201).json({
                    message: 'Cập nhật thành công'
                });
            });

            uploadStream.on('error', (err) => {
                next(createHttpError.InternalServerError());
            });
        } else {
            await user.save();
            return res.status(201).json({
                message: 'Cập nhật thành công', succes: false
            });
        }
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to update user profile')
        );
    }
};

exports.getAvatar = async (req, res, next) => {
    try {

        const fileId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return next(createHttpError.InternalServerError());
        }

        const avatarBucket = getAvatarBucket();

        const file = await avatarBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (!file || file.length === 0) {
            return next(createHttpError(404, 'Không tìm thấy file ảnh'));
        }

        res.set('Content-Type', file[0].contentType);
        const downloadStream = avatarBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (err) => {
            return next(createHttpError.InternalServerError());
        });

        downloadStream.pipe(res);

    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { MaDocGia } = req.query;
  
        const user = await User.findOne({ MaDocGia: MaDocGia });
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng với mã độc giả này'
            });
        }

        return res.status(200).json(user._id);
    } catch (error) {
        next(createHttpError.InternalServerError('Failed to retrieve user by MaDocGia'));
    }
};
//profile>>
