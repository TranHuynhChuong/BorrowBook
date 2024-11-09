const mongoose = require('mongoose');

// Định nghĩa schema cho model TheoDoiMuonSach
const BorrowLogSchema = new mongoose.Schema({
    ID_DocGia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocGia', // Tham chiếu đến model DocGia
        required: true, // Mã độc giả là bắt buộc
    },
    ID_Sach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sach', // Tham chiếu đến model Book (hoặc tên khác của schema sách)
        required: true, // Mã sách là bắt buộc
    },
    ID_NV: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    },
    NgayMuon: {
        type: Date,
        required: true, // Ngày mượn sách là bắt buộc
    },
    NgayTra: {
        type: Date,
        default: null,
    },
    TrangThai: {
        type: String,
        enum: ['DangKy', 'Muon', 'Tra'],
        default: 'DangKy',
    },
});

BorrowLogSchema.index(
    { ID_DocGia: 1, ID_Sach: 1, NgayMuon: 1 },
    { unique: true }
);

// Tạo và xuất model TheoDoiMuonSach từ schema đã định nghĩa
module.exports = mongoose.model('TheoDoiMuonSach', BorrowLogSchema);
