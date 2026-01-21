const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema(
    {
        schoolName: {
            type: String,
            required: true,
            trim: true,
        },
        npsn: {
            type: String,
            required: true,
            unique: true,
            minlength: 8,
            maxlength: 8,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "school",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt otomatis
    }
);

module.exports = mongoose.model("School", SchoolSchema);
