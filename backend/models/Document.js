const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    pengajuanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pengajuan',
        required: true
    },
    filename: String,
    fileUrl: String,
    fileType: String
}, { timestamps: true })

module.exports = mongoose.model('Document', documentSchema)
