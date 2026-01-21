const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    proposal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    transactionDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    recipient: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    evidence: {
        type: String, // URL to uploaded file
    },
    status: {
        type: String,
        enum: ['draft', 'submitted'],
        default: 'draft',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
