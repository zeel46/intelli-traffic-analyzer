const express = require('express');
const router = express.Router();
const { addWebsite, getUserWebsites, blockIp } = require('../controllers/websiteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addWebsite)
    .get(protect, getUserWebsites);

router.post('/:websiteId/block', protect, blockIp);

module.exports = router;
