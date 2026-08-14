const Analytics = require("../models/analyticsModel");

exports.getTeacherAnalytics = async (req, res) => {
    try {
        const analytics = await Analytics.getTeacherAnalytics(req.user.id);
        res.json({ success: true, analytics });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};