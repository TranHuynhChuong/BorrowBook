const mongoose = require('mongoose');


const BorrowLogSchema = new mongoose.Schema({
    ID_DocGia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocGia',
        required: true,
    },
    ID_Sach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sach', 
        required: true, 
    },
    ID_NV: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    },
    NgayMuon: {
        type: Date,
        required: true,
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

module.exports = mongoose.model('TheoDoiMuonSach', BorrowLogSchema);
