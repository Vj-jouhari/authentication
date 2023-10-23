const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const userSchema = new Schema({
    name : {type: String},
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    phoneNumber: {type: Number},
    otp : {type:Number},
    isStatus : {
        type: Boolean,
        default: false
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true })

module.exports = mongoose.model('User',userSchema)