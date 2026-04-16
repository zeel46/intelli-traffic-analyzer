const mongoose = require('mongoose');

const trafficLogSchema = new mongoose.Schema({
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Website'
    },
    page: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    sessionDuration: { type: Number, default: 0 },
    requestsPerMinute: { type: Number, default: 1 },
    repeatedPageRatio: { type: Number, default: 0 },
    uniquePagesVisited: { type: Number, default: 1 },
    anomalyResult: { type: String, default: "normal" },
    userTypeResult: { type: String, default: "normal" },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TrafficLog', trafficLogSchema);
