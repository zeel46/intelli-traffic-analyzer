const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    websiteName: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    blockedIps: [{ type: String }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Website', websiteSchema);
