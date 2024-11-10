/* eslint-disable no-unused-vars */
const createHttpError = require('http-errors');
const Publisher = require('../models/publisher_model');


exports.createPublisher = async (req, res, next) => {
    try {

        const publisher = new Publisher(req.body);
        await publisher.save();
        const publisherSeq = publisher.publisher_seq;

        const MaNXB = `P${publisherSeq.toString().padStart(4, '0')}`;
        await Publisher.findByIdAndUpdate(publisher._id, { MaNXB: MaNXB });
        
        res.status(201).json({ message: 'Thêm mới thành công' });
    } catch (error) {
        console.log(error);
        next(
            createHttpError.InternalServerError(
                'Thêm mới không thành công!'
            )
        );
    }
};

// Tìm Publisher 
exports.findPublisher = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const keyword = req.query.search; 

        // Nếu có ID, tìm kiếm theo ID
        if (id) {
            const publisher = await Publisher.findById(id).exec();
            if (!publisher) {
                return next(createHttpError.NotFound('Nhà xuất bản không tồn tại'));
            }
            return res.json(publisher); 
        }

        // Nếu không có ID, tìm kiếm theo từ khóa
        if (keyword) {
            const textResults = await Publisher.find({ $text: { $search: keyword } }).exec();
            const regexResults = await Publisher.find({ MaNXB: { $regex: keyword, $options: 'i' } } ).exec();
            const documents = [...textResults, ...regexResults];
            if (documents.length === 0) {
                return next(createHttpError.NotFound('Không tìm thấy mục sách phù hợp với từ khóa'));
            }
            return res.json(documents); 
        }

        const categories = await Publisher.find({}).exec();
        return res.json(categories);
    } catch (error) {
        next(createHttpError.InternalServerError('Tìm kiếm thất bại!')); 
    }
};


// Xóa Publisher theo ID
exports.deletePublisher = async (req, res, next) => {
    try {
        const document = await Publisher.findByIdAndDelete(
            req.params.id
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Xóa không thành công!'));
        }
        res.json({ message: 'Xóa thành công!' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Xóa không thành công!'
            )
        );
    }
};

// Cập nhật thông tin Publisher
exports.updatePublisher = async (req, res, next) => {
    try {
        const document = await Publisher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Cập nhật không thành công!'));
        }
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Cập nhật không thành công!'
            )
        );
    }
};