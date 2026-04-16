const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/websites', require('./routes/websiteRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/track', require('./routes/trackRoutes'));

// Serve tracker.js statically
app.use(express.static(path.join(__dirname)));
// Alternatively, serve just tracker.js specifically
app.get('/tracker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'tracker.js'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
