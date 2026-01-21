const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyReports, createReport, deleteReport } = require('../controllers/reportController');

router.use(auth); // Protect all routes

router.get('/', getMyReports);
router.post('/', createReport);
router.delete('/:id', deleteReport);

module.exports = router;
