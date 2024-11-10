const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StaffSchema = new mongoose.Schema({
    MSNV: {
        type: String,
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
});

StaffSchema.index({ HoTenNV: "text" });
StaffSchema.plugin(AutoIncrement, { inc_field: 'staff_seq', start_seq: 1 });
StaffSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        return next();    
    } else {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
    }
    next();
});



StaffSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.Password);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw createHttpError.InternalServerError();
    }
};

module.exports = mongoose.model('NhanVien', StaffSchema);
