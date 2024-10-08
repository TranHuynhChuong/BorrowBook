const createHttpError = require('http-errors');
const Book = require('../models/book_model'); // Giả sử bạn đã có mô hình Book
const Publisher = require('../models/publisher_model');

// Tạo sách mới
exports.createBook = async (req, res, next) => {
    if (!req.body?.MaSach) {
        return next(createHttpError(400, 'Mã sách không thể để trống'));
    }
    try {
        const doesExist = await Book.findOne({ MaSach: req.body.MaSach });
        if (doesExist) {
            return next(createHttpError(409, 'Mã sách đã tồn tại'));
        }
        const book = new Book(req.body);
        const document = await book.save();
        return res.status(201).json(document); // Trả về mã trạng thái 201 Created
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, 'Đã xảy ra lỗi khi tạo sách', error));
    }
};

// Tìm sách theo ID
exports.findOneBook = async (req, res, next) => {
    try {
        const document = await Book.findById(req.params.id).exec();

        if (!document) {
            return next(createHttpError(404, 'Sách không được tìm thấy'));
        }
        return res.json(document);
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Lỗi khi truy xuất sách với ID=${req.params.id}`,
                error
            )
        );
    }
};

// Tìm sách bằng từ khóa
exports.findBookByFilter = async (req, res, next) => {
    try {
        //const keyword = req.body.keyword; // Từ khóa người dùng nhập vào
        const keyword = req.query.keyword;
        if (!keyword) {
            return next(
                createHttpError(400, 'Vui lòng nhập từ khóa để tìm kiếm')
            );
        }

        // Tìm kiếm nhà xuất bản trước nếu từ khóa có thể khớp với tên nhà xuất bản
        const nxb = await Publisher.findOne({
            TenNXB: { $regex: keyword, $options: 'i' },
        });

        const filter = {
            $or: [
                { MaSach: { $regex: keyword, $options: 'i' } },
                { TenSach: { $regex: keyword, $options: 'i' } },
                { TacGia: { $regex: keyword, $options: 'i' } },
                { TheLoai: { $regex: keyword, $options: 'i' } },
            ],
        };

        // Nếu tìm thấy nhà xuất bản, thêm mã NXB vào bộ lọc
        if (nxb) {
            filter.$or.push({ MaNXB: nxb.MaNXB });
        }

        // Tìm kiếm sách dựa trên filter
        const documents = await Book.find(filter).exec();

        if (documents.length === 0) {
            return next(
                createHttpError(404, 'Không tìm thấy sách phù hợp với từ khóa')
            );
        }

        return res.json(documents);
    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

// Cập nhật thông tin sách
exports.updateBook = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            createHttpError(400, 'Dữ liệu cập nhật không thể để trống')
        );
    }
    try {
        const document = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).exec();

        if (!document) {
            return next(createHttpError(404, 'Sách không được tìm thấy'));
        }
        return res.json({
            message: 'Sách đã được cập nhật thành công',
            document,
        });
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Không thể cập nhật sách với ID=${req.params.id}`,
                error
            )
        );
    }
};

// Xóa sách theo ID
exports.deleteBook = async (req, res, next) => {
    try {
        const document = await Book.findByIdAndDelete(req.params.id).exec();

        if (!document) {
            return next(createHttpError(404, 'Sách không được tìm thấy'));
        }
        return res.json({ message: 'Sách đã được xóa thành công' });
    } catch (error) {
        return next(
            createHttpError(
                500,
                `Không thể xóa sách với ID=${req.params.id}`,
                error
            )
        );
    }
};

// Xóa tất cả sách
exports.deleteAllBook = async (req, res, next) => {
    try {
        const result = await Book.deleteMany({}).exec(); // Xóa tất cả sách
        return res.json({
            message: `${result.deletedCount} sách đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            createHttpError(500, 'Đã xảy ra lỗi khi xóa tất cả sách', error)
        );
    }
};
