const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BookSchema = new Schema({
    MaSach: {
        type: String,
        unique: true,
    },
    TenSach: {
        type: String,
        required: true,
    },
    DonGia: {
        type: Number,
        required: true,
    },
    SoLuong: {
        type: Number,
        required: true,
    },
    SoLuongHienTai: {
        type: Number,
    },
    NamXuatBan: {
        type: Number,
        required: true,
    },
    NXB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhaXuatBan',
        required: true,
    },
    TacGia: {
        type: String,
        required: true,
    },
    TheLoai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DanhMuc',
        required: true,
    },
    BiaSach: {
        type: String,
        default: null,
    }
});
BookSchema.index({ TenSach: "text" });
BookSchema.plugin(AutoIncrement, { inc_field: 'book_seq', start_seq: 1 });

module.exports = mongoose.model('Sach', BookSchema);
