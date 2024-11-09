/* eslint-disable no-unused-vars */
const createHttpError = require('http-errors');
const Book = require('../models/book_model');
const Publisher = require('../models/publisher_model');
const Category = require('../models/catergory_model');
const { getCoverBucket } = require('../utils/mongodb_util');
const mongoose = require('mongoose');

exports.createBook = async (req, res, next) => {
    try {
        const book = new Book(req.body);
        book.SoLuongHienTai = book.SoLuong;
        await book.save();

        const bookSeq = book.book_seq;
        const MaSach = `B${bookSeq.toString().padStart(4, '0')}`;
        await Book.findByIdAndUpdate(book._id, { MaSach: MaSach });
        if (req.file) {
            const coverBucket = getCoverBucket();
            const uploadStream = coverBucket.openUploadStream(req.file.originalname);

            uploadStream.end(req.file.buffer);
            uploadStream.on('finish', async () => {
                book.BiaSach = uploadStream.id; 
                await book.save();
                res.status(201).json({
                    message: 'Thêm sách thành công',
                    sucess: true
                });
            });

            uploadStream.on('error', (err) => {
                next(createHttpError.InternalServerError());
            });
        } else {
            res.status(400).json({ message: 'Thêm sách thất bại', sucess: false });
        }

    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

exports.getBookImage = async (req, res, next) => {
    try {

        const fileId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return next(createHttpError.InternalServerError());
        }

        const coverBucket = getCoverBucket();

        const file = await coverBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (!file || file.length === 0) {
            return next(createHttpError(404, 'Không tìm thấy file ảnh'));
        }

        res.set('Content-Type', file[0].contentType);
        const downloadStream = coverBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (err) => {
            return next(createHttpError.InternalServerError());
        });

        downloadStream.pipe(res);

    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

exports.getBookImageName = async (req, res, next) => {
    try {
        const fileId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return next(createHttpError(400, 'ID của file không hợp lệ'));
        }

        const coverBucket = getCoverBucket();

        const file = await coverBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (!file || file.length === 0) {
            return next(createHttpError.InternalServerError());
        }
         
        res.json(file[0].filename);

    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};


exports.findBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const keyword = req.query.search;

        console.log("ID:", id);
        console.log("Keyword:", keyword);
        
        if (id) {
            const book = await Book.findById(id)
                .populate('NXB', 'TenNXB')
                .populate('TheLoai', 'TenMucSach')
                .exec();
            if (!book) {
                return res.json([]);
            }
            return res.json(book);
        }

        if (keyword) {
            const textResults = await Book.find({ $text: { $search: `^${keyword}$` } })
                .populate('NXB', 'TenNXB')
                .populate('TheLoai', 'TenMucSach')
                .exec();
            const regexResults = await Book.find({ MaSach: { $regex: keyword, $options: 'i' } })
                .populate('NXB', 'TenNXB')
                .populate('TheLoai', 'TenMucSach')
                .exec();

            const combinedResults = [...textResults, ...regexResults];
            const uniqueResults = Array.from(new Set(combinedResults.map(book => book._id))).map(id => {
                return combinedResults.find(book => book._id.equals(id));
            });

            if (uniqueResults.length === 0) {
                return res.json([]);
            }
            return res.json(uniqueResults);
        }

        const books = await Book.find({})
            .populate('NXB', 'TenNXB')
            .populate('TheLoai', 'TenMucSach')
            .exec();
        return res.json(books);
    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};

exports.findBookByCategory = async (req, res, next) => {
    try {
        const { id } = req.params;  
        const category = await Category.findById(id);
        const categoryName = category.TenMucSach;
        const books = await Book.find({ TheLoai: id });

        return res.json({books: books, categoryName: categoryName});

    } catch (error) {
        next(createHttpError.InternalServerError());
    }
};


// Cập nhật thông tin sách
exports.updateBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return next(createHttpError.InternalServerError());
        }

        Object.assign(book, req.body);

        if (req.file) {
            const coverBucket = getCoverBucket();
            if (book.BiaSach) {
                try {
                    const fileId = new mongoose.Types.ObjectId(book.BiaSach);
                    const fileExists = await coverBucket.find({ _id: fileId }).toArray();
                    if (fileExists.length !== 0) {
                        await coverBucket.delete(fileId);
                    }
                } catch (err) {
                    next(createHttpError.InternalServerError());
                }
            }

            const uploadStream = coverBucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer); 
            uploadStream.on('finish', async () => {
                book.BiaSach = uploadStream.id; 
                await book.save();
                return res.status(201).json({
                    message: 'Cập nhật thành công'
                });
            });

            uploadStream.on('error', (err) => {
                next(createHttpError.InternalServerError());
            });
        } else {
            await book.save();
            return res.status(201).json({
                message: 'Cập nhật thành công', succes: false
            });
        }

    } catch (error) {
        createHttpError.InternalServerError()
    }
};

// Xóa sách theo ID
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            next(createHttpError.InternalServerError());
        }
        const coverBucket = getCoverBucket();
        const fileId = new mongoose.Types.ObjectId(book.BiaSach);
        const fileExists = await coverBucket.find({ _id: fileId }).toArray();
        if (fileExists.length > 0) {
            await coverBucket.delete(fileId);
        }

        await Book.findByIdAndDelete(req.params.id).exec();

        return res.json({ message: 'Sách đã được xóa thành công', succes: false });
    } catch (error) {
        return next(
            createHttpError.InternalServerError()
        );
    }
};

// Xóa tất cả sách
exports.deleteAllBook = async (req, res, next) => {
    try {
        const result = await Book.deleteMany({}).exec(); 
        return res.json({
            message: `${result.deletedCount} sách đã được xóa thành công`, sucess: true
        });
    } catch (error) {
        return next(
            createHttpError.InternalServerError()
        );
    }
};
