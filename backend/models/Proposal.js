const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    // 1. Informasi Umum
    title: { type: String, default: '' },
    category: { type: String, default: '' },
    region: { type: String, default: '' },
    description: { type: String, default: '' },

    // 2. Informasi Sekolah (Snapshot)
    schoolName: { type: String },
    npsn: { type: String },
    contactPhone: { type: String },
    principalName: { type: String },
    schoolAddress: { type: String },
    principalAddress: { type: String },

    // 3. Kondisi Awal
    background: { type: String },
    purpose: { type: String },
    benefits: { type: String },

    // 4. Rencana Dana & Waktu
    targetAmount: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },

    // Files (Store URLs) - For now just string paths
    files: {
        schoolCertificate: String,
        proposalDoc: String,
        schoolPhoto: [String],
        budgetPlan: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
