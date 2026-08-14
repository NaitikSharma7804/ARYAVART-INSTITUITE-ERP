const AdminAnalytics = require("../models/adminAnalyticsModel");

exports.getAnalytics = async (req, res) => {
    try {
        const data = await AdminAnalytics.getAdminAnalytics();
        res.json({ success: true, data });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

