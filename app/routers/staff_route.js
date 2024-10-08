const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff_controller');
const createHttpError = require('http-errors');

const Roles = {
    ThuThu: 'TT',
    QuanKho: 'QK',
    QuanTriVien: 'QT',
};
const ensureRole = (requiredRole) => {
    return (req, res, next) => {
        if (
            req.user &&
            req.user.user &&
            req.user.user.MSNV.startsWith(requiredRole)
        )
            next();
        else next(createHttpError.Forbidden());
    };
};

router.get('/', (req, res) => {
    res.json({ message: 'Staff page' });
});

router.get('/profile', StaffController.profile); //Xem thông tin cá nhân

////////////////////////////////////////// QUẢN TRỊ VIÊN //////////////////////////////////////////////////////

router.all(
    '/manage-users',
    ensureRole(Roles.QuanTriVien),
    require('../routers/staff-admin_route')
);

////////////////////////////////////////// QUẢN KHO //////////////////////////////////////////////////////

router.all(
    '/manage-books',
    ensureRole(Roles.QuanKho),
    require('../routers/staff-warehouseM_route')
);

router.all(
    '/manage-publishers',
    ensureRole(Roles.QuanKho),
    require('../routers/staff-warehouseM_route')
);

////////////////////////////////////////// THỦ THƯ //////////////////////////////////////////////////////

router.all(
    '/manage-borrowLogs',
    ensureRole(Roles.ThuThu),
    require('../routers/staff-librarian_route')
);

module.exports = router;
