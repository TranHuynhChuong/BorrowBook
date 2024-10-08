const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheLoaiSchema = new Schema({
    TenTheLoai: {
        type: String,
        required: true,
    },
    TheLoaiCha: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TheLoai',
        default: null,
    },
    SuaDoiLanCuoi: {
        type: Date,
    },
    NguoiThucHien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NhanVien',
    }
});


module.exports = mongoose.model('TheLoai', TheLoaiSchema);
