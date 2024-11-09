/* eslint-disable no-unused-vars */

const passport = require('passport');
const createError = require('http-errors');
const User = require('../models/user_model');


exports.checkLoggedin = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            res.json({ success: true, loggedIn: true, user: req.user });
            
        } else {
            // Nếu chưa đăng nhập
            return res.json({ success: true, loggedIn: false });
        }
    } catch (error) {
        res.status(500).json({ success: false});
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)  return next(createError.NotFound({success: false,message:'Tên đăng nhập/Mật khẩu không chính xác!'}));
        if (!user) {
            return next(createError.NotFound({success: false,message:'Tên đăng nhập/Mật khẩu không chính xác!'}));
        }
        req.login(user, (err) => {
            if (err)  return next(createError.NotFound({success: false, message:'Tên đăng nhập/Mật khẩu không chính xác!'}));
            res.status(200).json({ success: true, user: user });
        });
    })(req, res, next);
};

exports.register = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
        }

        const newUser = new User(req.body);
        await newUser.save();
        const newUserSeq = User.user_seq;

        const MaDocGia = `R${newUserSeq.toString().padStart(4, '0')}`;
        await User.findByIdAndUpdate(newUserSeq._id, { MaDocGia: MaDocGia });

        req.login(newUser, (err) => {
            if (err) return next(createError.InternalServerError());
            res.status(201).json({ success: true, user: newUser });
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


exports.logout = async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) return next(createError.InternalServerError());
            // Xóa session
            req.session.destroy((err) => {
                if (err) return next(createError.InternalServerError());
                // Xóa cookie liên kết với session
                res.clearCookie('connect.sid');
                // Trả về phản hồi thành công sau khi xóa session
                res.status(200).json({ success: true });
            });
        });
    } catch (error) {
        next(error);
    }
};
