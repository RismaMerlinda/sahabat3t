const mongoose = require('mongoose')

const pengajuanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    judul: { type: String, required: true },
    deskripsi: String,
    targetDana: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('Pengajuan', pengajuanSchema)
