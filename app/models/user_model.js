const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');

const Userchema = new mongoose.Schema({
    MaDocGia: {
        type: String,
        required: true,
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
        type: String, // Lưu trữ ảnh dưới dạng Base64
    },
});

// Middleware trước khi lưu tài liệu vào cơ sở dữ liệu
Userchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        // Kiểm tra xem trường mật khẩu có bị thay đổi không
        return next(); // Nếu không thay đổi, bỏ qua middleware và tiếp tục lưu tài liệu
    }

    try {
        const salt = await bcrypt.genSalt(10); // Tạo salt với độ phức tạp là 10
        this.password = await bcrypt.hash(this.password, salt); // Mã hóa mật khẩu với salt

        next();
    } catch (error) {
        next(error);
    }
});

// Phương thức kiểm tra mật khẩu hợp lệ
Userchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Error comparing password:', error); // Ghi log lỗi chi tiết
        throw createHttpError.InternalServerError();
    }
};
module.exports = mongoose.model('DocGia', Userchema);
