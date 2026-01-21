const Report = require('../models/Report');
const Proposal = require('../models/Proposal');

// Get all reports for the logged-in user
exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id })
            .populate('proposal', 'title') // Populate proposal title
            .sort({ updatedAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update a Report
exports.createReport = async (req, res) => {
    try {
        const {
            proposalId,
            title,
            transactionDate,
            description,
            recipient,
            amount,
            evidence,
            status
        } = req.body;

        if (!proposalId) {
            return res.status(400).json({ message: 'Proposal is required' });
        }

        // Optional: Verify proposal belongs to user or is approved
        // const proposal = await Proposal.findById(proposalId);
        // if (!proposal) ...

        const report = await Report.create({
            user: req.user.id,
            proposal: proposalId,
            title,
            transactionDate,
            description,
            recipient,
            amount,
            evidence,
            status: status || 'draft'
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        await report.deleteOne();
        res.json({ message: 'Laporan dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
