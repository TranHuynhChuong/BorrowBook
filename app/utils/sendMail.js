/* eslint-disable no-unused-vars */
const nodemailer = require('nodemailer');
const createHttpError = require('http-errors');
const { generateOTP } = require('./generateOTP');
const OTP = require('../models/otp_model');
require('dotenv').config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc nhà cung cấp email khác
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendBorrowEmail(email) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Đăng ký mượn sách thành công',
        text: `Sách bạn đăng ký mượn đã xác nhận thành công, bạn có thể đến nhận sách từ ngày mai.`,
    };

    // Gửi email không đồng bộ và không chờ phản hồi
    transporter.sendMail(mailOptions).catch((error) => {
        console.error(`Failed to send email to ${email}: ${error.message}`);
    });

    // Ngay lập tức trả về phản hồi
    return { success: true, message: 'Email is being sent' };
}

async function sendOTPEmail(email) {
    const otp = generateOTP();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It expires in 3 minutes.`,
    };

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    const otpRecord = new OTP({ email, otp, expiresAt });
    await otpRecord.save();

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { sendOTPEmail, sendBorrowEmail };
