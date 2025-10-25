import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    optEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otpCode: {
        type: String,
        required: true,
    },
    otpExpiresAt: {
        type: Date,
        required: true,
    },
    otpCreatedAt: {
        type: Date,
        default: Date.now,
        expires: 600
    },
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
