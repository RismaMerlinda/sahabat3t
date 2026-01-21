const Proposal = require('../models/Proposal');

// Get all proposals for current user
exports.getMyProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new draft
exports.createDraft = async (req, res) => {
    try {
        const {
            title, category, region, description,
            schoolName, npsn, contactPhone, principalName, schoolAddress, principalAddress,
            background, purpose, benefits,
            targetAmount, startDate, endDate
        } = req.body;

        const newProposal = await Proposal.create({
            user: req.user.id,
            status: 'draft',
            title, category, region, description,
            schoolName, npsn, contactPhone, principalName, schoolAddress, principalAddress,
            background, purpose, benefits,
            targetAmount, startDate, endDate
        });

        res.status(201).json(newProposal);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat draft', error: error.message });
    }
};

// Update a draft
exports.updateDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const proposal = await Proposal.findOne({ _id: id, user: req.user.id });

        if (!proposal) {
            return res.status(404).json({ message: 'Draft tidak ditemukan' });
        }

        if (proposal.status !== 'draft') {
            // Optional: Block update if submitting? For now allow update if implemented
        }

        // Update fields
        Object.assign(proposal, req.body);
        const updated = await proposal.save();

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Gagal update draft', error: error.message });
    }
};

// Delete a draft
exports.deleteDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Proposal.findOneAndDelete({ _id: id, user: req.user.id });

        if (!deleted) {
            return res.status(404).json({ message: 'Draft tidak ditemukan' });
        }

        res.json({ message: 'Draft berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus draft', error: error.message });
    }
};

// Submit (Change status to pending)
exports.submitProposal = async (req, res) => {
    try {
        const { id } = req.params;
        const proposal = await Proposal.findOne({ _id: id, user: req.user.id });

        if (!proposal) {
            return res.status(404).json({ message: 'Proposal tidak ditemukan' });
        }

        proposal.status = 'pending';
        await proposal.save();

        res.json({ message: 'Proposal berhasil dikirim', proposal });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengirim proposal', error: error.message });
    }
};
