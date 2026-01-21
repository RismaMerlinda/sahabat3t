const express = require('express')
const router = express.Router()
const Timeline = require('../models/Timeline')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    const timeline = await Timeline.create(req.body)
    res.status(201).json(timeline)
})

router.get('/:pengajuanId', auth, async (req, res) => {
    const data = await Timeline.find({ pengajuanId: req.params.pengajuanId })
    res.json(data)
})

module.exports = router
