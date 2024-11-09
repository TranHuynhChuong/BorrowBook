const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user_model');
const Staff = require('../models/staff_model');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                // Tìm người dùng dựa trên email hoặc MSNV
                let user = await User.findOne({ email: username });
                if (!user) {
                    user = await Staff.findOne({ MSNV: username });
                }

                if (!user) {
                    return done(null, false, {
                        message:'Tên đăng nhập/Mật khẩu không chính xác!',
                    });
                }

                // Kiểm tra mật khẩu
                const isMatch = await user.isValidPassword(password);
                if (!isMatch) {
                    return done(null, false, { message:'Tên đăng nhập/Mật khẩu không chính xác!' });
                }

                // Xác thực thành công
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {

        const account = await User.findById(id);
        if (account) {
            return done(null, { user: account });
        }

        const staff = await Staff.findById(id);
        if (staff) {
            return done(null, { user: staff });
        }
        return done(new Error('User not found'));
    } catch (err) {
        done(err);
    }
});
