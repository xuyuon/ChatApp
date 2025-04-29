const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    userType: {
        type: String,
        enum: ['licensed', 'unlicensed'],
        default: 'unlicensed',
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // avatar: {
    //     type: String,
    // },
}, {
    timestamps: true,
});

module.exports = model('User', userSchema);