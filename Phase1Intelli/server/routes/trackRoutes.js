const express = require('express');
const router = express.Router();
const axios = require('axios');
const TrafficLog = require('../models/TrafficLog');
const Website = require('../models/Website');

router.post('/', async (req, res) => {
    try {
        const { apiKey, page, userAgent, timestamp } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!apiKey) {
            return res.status(400).json({ message: 'API Key is required' });
        }

        const website = await Website.findOne({ apiKey });
        if (!website) {
            return res.status(401).json({ message: 'Invalid API Key' });
        }

        if (website.blockedIps && website.blockedIps.includes(ip)) {
            return res.status(403).json({ message: 'IP is blocked' });
        }

        // --- Calculate/Mock Features for AI ---
        const requestsPerMinute = Math.floor(Math.random() * 50) + 1;
        const repeatedPageRatio = Math.random();
        const sameIpHits = Math.floor(Math.random() * 10) + 1;
        const uniquePages = Math.floor(Math.random() * 5) + 1;
        const avgTimeGap = Math.random() * 20;
        const sessionDuration = Math.floor(Math.random() * 300);
        
        let anomalyResult = "normal";
        let userTypeResult = "normal";

        try {
            // Call AI Microservice
            const aiData = {
                requests_per_minute: requestsPerMinute,
                repeated_page_ratio: repeatedPageRatio,
                same_ip_hits: sameIpHits,
                session_duration: sessionDuration,
                unique_pages: uniquePages,
                avg_time_gap: avgTimeGap
            };

            const [anomalyRes, userTypeRes] = await Promise.all([
                axios.post('http://localhost:8000/predict-anomaly', aiData).catch(() => null),
                axios.post('http://localhost:8000/predict-user-type', aiData).catch(() => null)
            ]);

            if (anomalyRes && anomalyRes.data) anomalyResult = anomalyRes.data.result;
            if (userTypeRes && userTypeRes.data) userTypeResult = userTypeRes.data.result;
        } catch (err) {
            console.warn("AI Service unavailable. Defaulting to normal.");
        }

        await TrafficLog.create({
            websiteId: website._id,
            page,
            userAgent,
            ip,
            timestamp: timestamp || new Date(),
            sessionDuration,
            requestsPerMinute,
            repeatedPageRatio,
            uniquePagesVisited: uniquePages,
            anomalyResult,
            userTypeResult
        });

        res.status(200).json({ success: true, ai: { anomalyResult, userTypeResult }});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
