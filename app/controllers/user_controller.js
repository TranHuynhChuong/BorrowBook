/* eslint-disable no-unused-vars */
const BorrowLog = require('../models/borrowLog_model');
const User = require('../models/user_model');
const createHttpError = require('http-errors');
const Profile = require('../models/user_model');
const { sendOTPEmail, sendBorrowEmail } = require('../utils/sendMail');
const OTP = require('../models/otp_model');

exports.RegisterBorrow = async (req, res, next) => {
    try {
        const { NgayMuon, NgayTra } = req.body;
        const MaDocGia = req.user.user._id.toString();
        const MaSach = req.params.id;
        const borowLog = new BorrowLog({ MaDocGia, MaSach, NgayMuon, NgayTra });
        const borrowLogSaved = await borowLog.save();

        //Gửi mail đăng ký thành công
        sendBorrowEmail(req.user.user.email).catch((error) => {
            console.error(`Failed to send borrow email: ${error.message}`);
        });

        // Trả về phản hồi ngay lập tức
        res.status(201).json({
            borrowLogSaved,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllBorrowLog = async (req, res, next) => {
    try {
        const borowLogs = await BorrowLog.find({});
        res.json(borowLogs);
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve publisher members'
            )
        );
    }
};

//profile>>
//
// Lấy thông tin hồ sơ người dùng
exports.profile = async (req, res, next) => {
    try {
        const profiles = await Profile.find({ accountId: req.user.user._id });
        const profile = profiles[0];
        const { HoLot, Ten, NgaySinh, Phai, DiaChi, SoDienThoai } = profile;
        res.json({
            HoLot,
            Ten,
            NgaySinh,
            Phai,
            DiaChi,
            SoDienThoai,
        });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Failed to retrieve user profile'
            )
        );
    }
};
exports.sendOTP = async (req, res, next) => {
    try {
        const email = req.user.user.email;
        const result = await sendOTPEmail(email);
        if (result.success) {
            res.json({
                message: result.message,
            });
        } else {
            res.status(500).json({
                message: result.message,
            });
        }
    } catch (error) {
        next(
            // createHttpError.InternalServerError(
            //     'Failed to retrieve user account'
            // )
            error
        );
    }
};

exports.getAccount = async (req, res, next) => {
    try {
        const email = req.user.user.email;
        const otps = await OTP.find({ email }).sort({
            expiresAt: -1,
        });
        if (otps.length === 0) {
            res.json({ success: false, mesage: 'OTP đã hết hạn' });
        }
        const otp = otps[0];
        if (otp.otp === req.body.otp) {
            res.json({ success: true, email });
        } else {
            res.json({ success: false, mesage: 'OTP không trùng khớp' });
        }
    } catch (error) {
        next(
            // createHttpError.InternalServerError(
            //     'Failed to retrieve user account'
            // )
            error
        );
    }
};

// Cập nhật hồ sơ người dùng
exports.profileUpdate = async (req, res, next) => {
    try {
        const update = req.body;

        const updatedProfile = await Profile.findOneAndUpdate(
            { accountId: req.user.user._id },
            update,
            { new: true }
        ).exec();

        if (!updatedProfile) {
            return next(createHttpError.NotFound('User member not found'));
        }
        res.json(updatedProfile);
    } catch (error) {
        next(
            createHttpError.InternalServerError('Failed to update user profile')
        );
    }
};

// Cập nhật mật khẩu
exports.updatePassword = async (req, res, next) => {
    try {
        const user = req.user.user;
        const { oldPassword, newPassword } = req.body;

        const isMatch = await user.isValidPassword(oldPassword);
        if (!isMatch) {
            return next(
                createHttpError.Unauthorized('Old password is incorrect')
            );
        }

        user.Password = newPassword;
        await user.save();
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
