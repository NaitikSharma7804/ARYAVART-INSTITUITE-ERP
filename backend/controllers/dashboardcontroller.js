const Dashboard = require("../models/dashboardModel");

const getStats = async (req, res) => {

    try {

        const stats = await Dashboard.getStats();

        res.json({

            success: true,

            stats

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {

    getStats

};