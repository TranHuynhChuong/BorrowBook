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

require('dotenv').config();
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());



// Cấu hình Session (khởi tạo session)
// Quản lý thông tin các phiên
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
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


app.use('/api/auth', require('./app/routers/auth_route'));
app.use('/api/book', require('./app/routers/book_route'));
app.use('/api/category', require('./app/routers/category_route'));
app.use('/api/manage', ensureLoggedIn({ redirectTo: '/api/auth' }), require('./app/routers/manage_route'));
app.use('/api/user', ensureLoggedIn({ redirectTo: '/api/user' }), require('./app/routers/user_route'));

//app.use('/api/profile', require('./app/routers/profile_route'));


//404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: { message: error.message } });
});

module.exports = app;
