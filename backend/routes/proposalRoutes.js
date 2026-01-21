const express = require('express');
const router = express.Router();
const controller = require('../controllers/proposalController');
const auth = require('../middleware/auth');

// Protected Routes
router.use(auth);

router.get('/', controller.getMyProposals);
router.post('/', controller.createDraft);
router.put('/:id', controller.updateDraft);
router.delete('/:id', controller.deleteDraft);
router.post('/:id/submit', controller.submitProposal);

module.exports = router;
