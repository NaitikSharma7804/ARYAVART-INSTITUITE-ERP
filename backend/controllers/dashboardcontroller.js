const Dashboard = require("../models/dashboardmodel");

exports.getDashboard = async (req, res) => {

    try {

        const stats = await Dashboard.getStats();

        const admissions = await Dashboard.getRecentAdmissions();

        res.json({
            success: true,
            stats,
            admissions
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

};