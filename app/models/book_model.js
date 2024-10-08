const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho model Sách
const BookSchema = new Schema({
    MaSach: {
        type: String,
        required: true,
        unique: true,
    },
    TenSach: {
        type: String,
        //required: true,
    },
    DonGia: {
        type: Number,
        //required: true,
    },
    SoQuyen: {
        type: Number,
        //required: true,
    },
    NamXuatBan: {
        type: Number,
        //required: true,
    },
    ID_NXB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhaXuatBan',
        required: true,
    },
    TacGia: {
        type: String,
        //required: true,
    },
    TheLoai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TheLoai',  // Liên kết với thể loại qua ObjectId
        required: true,
    },
    BiaSach: {
        type: String,
        default: null,
    },
    ViTri: {
        type: Number,
    },
    SuaDoiLanCuoi: {
        type: Date,
    },
    NguoiThucHien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    }
});

BookSchema.pre('save', function (next) {
    // Loại bỏ các trường có giá trị null hoặc undefined
    Object.keys(this.toObject()).forEach((key) => {
        if (this[key] === null || this[key] === undefined) {
            delete this[key];
        }
    });
    next();
});

// Tạo và xuất model Sách từ schema đã định nghĩa
module.exports = mongoose.model('Sach', BookSchema);
