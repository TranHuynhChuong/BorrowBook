const mongoose = require('mongoose'); // Import thư viện mongoose để làm việc với MongoDB
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');

const StaffProfileSchema = new mongoose.Schema({
    MSNV: {
        type: String,
        required: true,
        unique: true,
    },
    HoTenNV: {
        type: String,
        required: true,
    },
    ChucVu: {
        type: String,
        required: true,
    },
    DiaChi: {
        type: String,
    },
    SoDienThoai: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // Lưu trữ ảnh dưới dạng Base64
    },
    SuaDoiLanCuoi: {
        type: Date,
    },
    NguoiThucHien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    }
});
// Middleware trước khi lưu tài liệu vào cơ sở dữ liệu
StaffProfileSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        // Kiểm tra xem trường mật khẩu có bị thay đổi không
        return next(); // Nếu không thay đổi, bỏ qua middleware và tiếp tục lưu tài liệu
    }

    try {
        const salt = await bcrypt.genSalt(10); // Tạo salt với độ phức tạp là 10
        this.Password = await bcrypt.hash(this.Password, salt); // Mã hóa mật khẩu với salt
        next();
    } catch (error) {
        next(error);
    }
});

// Phương thức kiểm tra mật khẩu hợp lệ
StaffProfileSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.Password);
    } catch (error) {
        console.error('Error comparing password:', error); // Ghi log lỗi chi tiết
        throw createHttpError.InternalServerError();
    }
};
// Tạo và xuất model StaffProfile từ schema đã định nghĩa
module.exports = mongoose.model('NhanVien', StaffProfileSchema);
