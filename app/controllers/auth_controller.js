const { validationResult } = require('express-validator');
const passport = require('passport');
const createError = require('http-errors');
const User = require('../models/user_model');

exports.getLogin = async (req, res, next) => {
    try {
        res.status(200).json({ message: 'Login page' });
    } catch (error) {
        next(error);
    }
};

exports.postLogin = (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(createError.InternalServerError());
        if (!user) {
            return res.status(401).json({ message: 'Login failed' });
        }
        req.login(user, (err) => {
            if (err) return next(createError.InternalServerError());
            res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
};

exports.getRegister = async (req, res, next) => {
    try {
        res.status(200).json({ message: 'Register page' });
    } catch (error) {
        next(error);
    }
};

exports.postRegister = async (req, res, next) => {
    try {
        const {
            email,
            password,
            password2,
            MaDocGia,
            HoLot,
            Ten,
            NgaySinh,
            Phai,
            DiaChi,
            SoDienThoai,
        } = req.body;
        const errors = validationResult({ email, password, password2 });
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const doesExist = await User.findOne({ email });
        if (doesExist) {
            return res
                .status(409)
                .json({ message: 'Username/email already exists' });
        }

        const user = new User({
            MaDocGia,
            HoLot,
            Ten,
            NgaySinh,
            Phai,
            DiaChi,
            SoDienThoai,
            email,
            password,
        });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
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
                res.status(200).json({ message: 'Logout successful' });
            });
        });
    } catch (error) {
        next(error);
    }
};
