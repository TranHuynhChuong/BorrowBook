const mongoose = require('mongoose');

// Định nghĩa schema cho model NhaXuatBan
const NhaXuatBanSchema = new mongoose.Schema({
    MaNXB: {
        type: String,
        required: true, // Mã nhà xuất bản là bắt buộc
        unique: true, // Đảm bảo mã nhà xuất bản là duy nhất
    },
    TenNXB: {
        type: String,
        required: true, // Tên nhà xuất bản là bắt buộc
    },
    DiaChi: {
        type: String, // Địa chỉ không bắt buộc
    },
    SuaDoiLanCuoi: {
        type: Date,
    },
    NguoiThucHien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    }
});

// Tạo và xuất model NhaXuatBan từ schema đã định nghĩa
module.exports = mongoose.model('NhaXuatBan', NhaXuatBanSchema);
