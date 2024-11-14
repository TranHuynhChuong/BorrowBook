const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheLoaiSchema = new Schema({
    MaMucSach: {
        type: String,
        required: true,
        unique: true,
    },
    TenMucSach: {
        type: String,
        required: true,
    },
});

TheLoaiSchema.index({ TenMucSach: "text" });

module.exports = mongoose.model('DanhMuc', TheLoaiSchema);
