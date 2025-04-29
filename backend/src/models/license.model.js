import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
    licenseKey: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        sparse: true,
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
});

const License = mongoose.model("License", licenseSchema);

export default License;

