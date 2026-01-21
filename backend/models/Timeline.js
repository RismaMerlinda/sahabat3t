const mongoose = require('mongoose')

const timelineSchema = new mongoose.Schema({
    pengajuanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pengajuan',
        required: true
    },
    tanggal: Date,
    kegiatan: String,
    disetujui: { type: Boolean, default: false }
})

module.exports = mongoose.model('Timeline', timelineSchema)
