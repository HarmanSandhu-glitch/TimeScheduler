import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    userPassword: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function (value) {
                return value.length > 6;
            },
            message: "Password should be at least 6 characters long."
        }
    },
    userDayStartTime: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please enter a valid time in HH:mm format"],
        default: "09:00"
    },
    userDayEndTime: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please enter a valid time in HH:mm format"],
        default: "17:00"
    },
    userSessionSize: {
        type: Number,
        required: true,
        min: 1,
        max: 60,
        default: 15,
    },
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("userPassword")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.userPassword = await bcrypt.hash(this.userPassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

export default User;