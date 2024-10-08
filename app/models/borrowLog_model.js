const mongoose = require('mongoose');

// Định nghĩa schema cho model TheoDoiMuonSach
const BorrowLogSchema = new mongoose.Schema({
    ID_DocGia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocGia', // Tham chiếu đến model DocGia
        required: true, // Mã độc giả là bắt buộc
    },
    ID_Sach: {
        type: String,
        ref: 'Sach', // Tham chiếu đến model Book (hoặc tên khác của schema sách)
        required: true, // Mã sách là bắt buộc
    },
    NgayMuon: {
        type: Date,
        required: true, // Ngày mượn sách là bắt buộc
    },
    NgayTra: {
        type: Date, // Ngày trả sách không bắt buộc, có thể điền sau
    },
    TrangThai: {
        type: String,
        enum: ['Chờ duyệt', 'Đã duyệt', 'Đang mượn', 'Đã trả'],
        default: 'Chờ duyệt', // Giá trị mặc định nếu không được cung cấp
    },
    GiaHan: {
        type: Boolean,
        default: false,
    },
    SuaDoiLanCuoi: {
        type: Date,
    },
    NguoiThucHien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    }
});

BorrowLogSchema.index(
    { MaDocGia: 1, MaSach: 1, NgayMuon: 1 },
    { unique: true }
);

// Tạo và xuất model TheoDoiMuonSach từ schema đã định nghĩa
module.exports = mongoose.model('TheoDoiMuonSach', BorrowLogSchema);
