/* eslint-disable no-unused-vars */
const Category = require('../models/catergory_model');
const createHttpError = require('http-errors');

exports.createCategory = async (req, res, next) => {
    try {
        const isExit = await Category.find({ MaMucSach: { $regex: req.body.MaMucSach, $options: 'i' } } ).exec();
        if (isExit) {
            res.status(400).json({
                message: 'Mục sách đã tồn tại'
            });
        }
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({
            message: 'Thêm mới thành công'
        });
    } catch (error) {
        console.log(error);
        next(
            createHttpError.InternalServerError(
                'Thêm mới không thành công!'
            )
        );
    }
};

// Tìm mục bằng từ khóa
exports.findCategory = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const keyword = req.query.search; 

        // Nếu có ID, tìm kiếm theo ID
        if (id) {
            const category = await Category.findById(id).exec();
            if (!category) {
                return next(createHttpError.NotFound('Mục sách không tồn tại'));
            }
            return res.json(category); 
        }

        // Nếu không có ID, tìm kiếm theo từ khóa
        if (keyword) {
            const textResults = await Category.find({ $text: { $search: keyword } }).exec();
            const regexResults = await Category.find({ MaMucSach: { $regex: keyword, $options: 'i' } } ).exec();
            const documents = [...textResults, ...regexResults];
            if (documents.length === 0) {
                return next(createHttpError.NotFound('Không tìm thấy mục sách phù hợp với từ khóa'));
            }
            return res.json(documents); 
        }
        const categories = await Category.find({}).exec();
        return res.json(categories);
        
    } catch (error) {
        next(createHttpError.InternalServerError('Tìm kiếm thất bại!')); 
    }
};



// Xóa Category theo ID
exports.deleteCategory = async (req, res, next) => {
    try {
        const document = await Category.findByIdAndDelete(
            req.params.id
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Xóa thất bại!'));
        }
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Xóa thất bại!'
            )
        );
    }
};

// Cập nhật thông tin Category
exports.updateCategory = async (req, res, next) => {
    try {
        const isExit = Category.find({ MaMucSach: req.body.MaMucSach });
        if (isExit) {
            res.status(400).json({
                message: 'Mục sách đã tồn tại'
            });
        }
        const document = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).exec();
        if (!document) {
            return next(createHttpError.NotFound('Cập nhật thất bại!'));
        }
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        next(
            createHttpError.InternalServerError(
                'Cập nhật thất bại!'
            )
        );
    }
};