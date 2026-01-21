const express = require('express')
const router = express.Router()
const Pengajuan = require('../models/Pengajuan')
const Timeline = require('../models/Timeline')
const Document = require('../models/Document')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    const pengajuan = await Pengajuan.findOne({ userId: req.user.id })

    if (!pengajuan) {
        return res.json({ state: 'empty' })
    }

    if (pengajuan.status !== 'approved') {
        return res.json({
            state: 'pending',
            status: pengajuan.status
        })
    }

    const timeline = await Timeline.find({ pengajuanId: pengajuan._id })
    const documents = await Document.find({ pengajuanId: pengajuan._id })

    res.json({
        state: 'approved',
        pengajuan,
        timeline,
        documents
    })
})

module.exports = router
