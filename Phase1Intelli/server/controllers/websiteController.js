const Website = require('../models/Website');
const crypto = require('crypto');

const addWebsite = async (req, res) => {
    try {
        const { websiteName, domain } = req.body;
        
        // Generate a random API key
        const apiKey = crypto.randomBytes(16).toString('hex');

        const website = await Website.create({
            userId: req.user._id,
            websiteName,
            domain,
            apiKey
        });

        res.status(201).json({
            _id: website._id,
            websiteName: website.websiteName,
            domain: website.domain,
            apiKey: website.apiKey
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserWebsites = async (req, res) => {
    try {
        const websites = await Website.find({ userId: req.user._id });
        res.json(websites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const blockIp = async (req, res) => {
    try {
        const { websiteId } = req.params;
        const { ip } = req.body;
        
        const website = await Website.findOne({ _id: websiteId, userId: req.user._id });
        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }
        
        if (!website.blockedIps.includes(ip)) {
            website.blockedIps.push(ip);
            await website.save();
        }
        
        res.json({ success: true, message: 'IP blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addWebsite,
    getUserWebsites,
    blockIp
};
