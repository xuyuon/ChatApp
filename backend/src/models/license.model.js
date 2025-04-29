const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

const licenseSchema = new Schema({
    licenseKey: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: ObjectId,
        ref: "User",
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = model("License", licenseSchema);

