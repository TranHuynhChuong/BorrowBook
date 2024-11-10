const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Userchema = new mongoose.Schema({
    MaDocGia: {
        type: String,
        unique: true,
    },
    HoLot: {
        type: String,
        required: true,
    },
    Ten: {
        type: String,
        required: true,
    },
    NgaySinh: {
        type: Date,
        required: true,
    },
    Phai: {
        type: String,
        require: true,
    },
    DiaChi: {
        type: String,
    },
    SoDienThoai: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    }
});

Userchema.plugin(AutoIncrement, { inc_field: 'user_seq', start_seq: 1 });
Userchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();    
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Phương thức kiểm tra mật khẩu hợp lệ
Userchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Error comparing password:', error); 
        throw createHttpError.InternalServerError();
    }
};
module.exports = mongoose.model('DocGia', Userchema);
