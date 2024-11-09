const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const NhaXuatBanSchema = new mongoose.Schema({
    MaNXB: {
        type: String,
        unique: true,
    },
    TenNXB: {
        type: String,
        required: true,
    },
    DiaChi: {
        type: String,
        required: true,
    },

});
NhaXuatBanSchema.index({ TenNXB: "text" });

NhaXuatBanSchema.plugin(AutoIncrement, { inc_field: 'publisher_seq', start_seq: 1 });


module.exports = mongoose.model('NhaXuatBan', NhaXuatBanSchema);

