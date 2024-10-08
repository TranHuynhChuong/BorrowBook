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
                        message: 'Email or MSNV not registered',
                    });
                }

                // Kiểm tra mật khẩu
                const isMatch = await user.isValidPassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
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
        // Tìm kiếm trong Account
        const account = await User.findById(id);
        if (account) {
            return done(null, { type: 'account', user: account });
        }

        // Tìm kiếm trong Staff
        const staff = await Staff.findById(id);
        if (staff) {
            return done(null, { type: 'staff', user: staff });
        }

        // Nếu không tìm thấy cả Account và Staff
        return done(new Error('User not found'));
    } catch (err) {
        done(err);
    }
});
