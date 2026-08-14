const Dashboard = require("../models/studentDashboardModel");

exports.getDashboard = async (req, res) => {
    try {
        // req.user.id comes from your authMiddleware
        const data = await Dashboard.getStudentDashboardData(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error("Dashboard Controller Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getDashboard = async (req, res) => {
    try {
        console.log("DEBUG: User ID:", req.user.id);
        const data = await Dashboard.getStudentDashboardData(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error("DEBUG: CRASH ERROR:", err); // THIS WILL PRINT THE REAL ERROR
        res.status(500).json({ success: false, message: err.message });
    }
};