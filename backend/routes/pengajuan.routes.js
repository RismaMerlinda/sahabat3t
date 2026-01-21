const express = require('express')
const router = express.Router()
const Pengajuan = require('../models/Pengajuan')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    const pengajuan = await Pengajuan.create({
        userId: req.user.id,
        ...req.body
    })
    res.status(201).json(pengajuan)
})

router.get('/me', auth, async (req, res) => {
    const data = await Pengajuan.findOne({ userId: req.user.id })
    res.json(data)
})

module.exports = router
