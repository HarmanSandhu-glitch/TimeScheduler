import User from '../models/userModel.js';
import Otp from '../models/otpModel.js';
import bcrypt from 'bcryptjs';
import { sendMail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    console.log("signup controller hit");
    const { userEmail, userPassword, userName } = req.body;
    try {
        if (!userEmail || !userPassword || !userName) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (userPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await Otp.create({ optEmail: userEmail, otpCode, otpExpiresAt: expiresAt });
        await sendMail({
            to: userEmail,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}`,
            html: `<p>Your OTP code is <b>${otpCode}</b></p>`
        });

        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const signin = async (req, res) => {
    console.log("signin controller hit");
    const { userEmail, userPassword } = req.body;
    try {
        if (!userEmail || !userPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            success: true,
            message: 'Signin successful',
            token,
            user: {
                id: user._id,
                name: user.userName,
                email: user.userEmail
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    console.log("updateUser controller hit");
    const { userId } = req.params;
    const updates = req.body;
    try {
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    console.log("verifyOtp controller hit");
    const { userEmail, otpCode, userName, userPassword } = req.body;
    try {
        if (!userEmail || !otpCode || !userName || !userPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const otpEntry = await Otp.findOne({ optEmail: userEmail, otpCode: otpCode });

        if (!otpEntry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
        if (new Date() > new Date(otpEntry.otpExpiresAt)) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        const newUser = new User({
            userName,
            userEmail,
            userPassword: userPassword,
        });
        await newUser.save();
        await Otp.deleteOne({ _id: otpEntry._id });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.userName,
                email: newUser.userEmail
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
