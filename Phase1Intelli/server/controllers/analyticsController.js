const TrafficLog = require('../models/TrafficLog');
const Website = require('../models/Website');
const axios = require('axios');

const getAnalytics = async (req, res) => {
    try {
        const { websiteId } = req.params;

        // Verify website belongs to user
        const website = await Website.findOne({ _id: websiteId, userId: req.user._id });
        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }

        const totalVisits = await TrafficLog.countDocuments({ websiteId });

        const pageViews = await TrafficLog.aggregate([
            { $match: { websiteId: website._id } },
            { $group: { _id: "$page", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        
        const mostVisitedPage = pageViews.length > 0 ? pageViews[0]._id : "N/A";

        // Aggregate visits per hour
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const hourlyData = await TrafficLog.aggregate([
            { 
                $match: { 
                    websiteId: website._id,
                    timestamp: { $gte: twentyFourHoursAgo }
                } 
            },
            {
                $group: {
                    _id: { $hour: "$timestamp" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const visitsMap = {};
        hourlyData.forEach(hour => {
            visitsMap[hour._id] = hour.count;
        });

        const visitsPerHour = [];
        for (let i = 0; i <= 23; i++) {
            const h = i.toString().padStart(2, '0') + ":00";
            visitsPerHour.push({ hour: h, count: visitsMap[i] || 0 });
        }

        // AI specific aggregations
        const aiDistribution = await TrafficLog.aggregate([
            { $match: { websiteId: website._id } },
            { $group: { _id: "$userTypeResult", count: { $sum: 1 } } }
        ]);

        const anomaliesCount = await TrafficLog.countDocuments({ websiteId: website._id, anomalyResult: "anomaly" });

        const recentAnomalies = await TrafficLog.find({ websiteId: website._id, anomalyResult: "anomaly" })
            .sort({ timestamp: -1 })
            .limit(5);

        // Optional: call predicting traffic for next hour
        let predictedNextHour = 0;
        try {
            const currentHour = new Date().getHours();
            const forecastRes = await axios.post('http://localhost:8000/predict-traffic', { current_hour_index: currentHour }).catch(()=>null);
            if(forecastRes && forecastRes.data) {
                predictedNextHour = forecastRes.data.predicted_visitors;
            }
        } catch (e) { }

        // Calculate a fake health score based on anomalies
        const healthScore = totalVisits > 0 ? Math.max(0, 100 - Math.round((anomaliesCount / totalVisits) * 100)) : 100;

        res.json({
            totalVisits,
            mostVisitedPage,
            visitsPerHour,
            aiDistribution,
            recentAnomalies,
            anomaliesCount,
            predictedNextHour,
            healthScore
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
