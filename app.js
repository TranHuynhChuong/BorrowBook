/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const createHttpError = require('http-errors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const { ensureLoggedIn } = require('connect-ensure-login');
const config = require('./app/config');
const dbMiddleware = require('./app/utils/dbMiddleware');
require('dotenv').config();
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(dbMiddleware);

// Middleware để kiểm tra loại user
function ensureStaffOrUser(req, res, next) {
    if (req.user) {
        if (req.user.type === 'staff') {
            return require('./app/routers/staff_route')(req, res, next);
        } else if (req.user.type === 'user') {
            return require('./app/routers/user_route')(req, res, next);
        } else {
            return next(createHttpError.Forbidden());
        }
    } else {
        next(createHttpError.Unauthorized());
    }
}

// Cấu hình Session (khởi tạo session)
// Quản lý thông tin các phiên
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
        store: MongoStore.create({ mongoUrl: config.db.uri }),
    })
);

// Cấu hình Passport
// Xác thực người dùng
// Khởi tạo Passport (cho app)
app.use(passport.initialize());
// Kết nối Passport với Session
app.use(passport.session());
require('./app/utils/passportAuth_util');

//Cấu hình Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my book application.' });
});
app.use('/api/books', require('./app/routers/book_route'));
app.use('/api/auth', require('./app/routers/auth_route'));
app.use(
    '/api/:id',
    ensureLoggedIn({ redirectTo: '/auth/login' }), // Yêu cầu người dùng phải đăng nhập
    ensureStaffOrUser // Kiểm tra loại user và điều hướng tới route tương ứng
);

// 404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: { message: error.message } });
});

module.exports = app;
