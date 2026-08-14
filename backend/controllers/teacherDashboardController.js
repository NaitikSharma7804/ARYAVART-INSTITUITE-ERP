const Dashboard = require("../models/teacherDashboardModel");

exports.dashboard = async (req, res) => {

    try {

        const classes = await Dashboard.getTodayClasses(req.user.id);

        res.json({
            success: true,
            dashboard: {
                todayClasses: classes.length,
                pendingHomework: 0,
                pendingDoubts: 0,
                attendance: 100,
                classes
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};