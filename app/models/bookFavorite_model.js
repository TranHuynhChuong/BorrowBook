const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DanhSachYeuThichSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model User
        required: true,
    },
    books: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sach', // Tham chiếu đến model Sach
            required: true,
        },
        addedAt: {
            type: Date,
            default: Date.now, // Ngày giờ thêm vào danh sách
        },
    }],
});

module.exports = mongoose.model('YeuThich', DanhSachYeuThichSchema);
