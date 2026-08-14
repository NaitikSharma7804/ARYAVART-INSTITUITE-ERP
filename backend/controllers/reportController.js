const Report = require("../models/reportModel");

exports.generateReport = async (req, res) => {
    try {
        const type = req.params.type;
        let data = [];

        switch (type) {
            case "fees":
                data = await Report.getFeeReport();
                break;
            case "admissions":
                data = await Report.getAdmissionsReport();
                break;
            case "batches":
                data = await Report.getBatchReport();
                break;
            case "faculty":
                data = await Report.getFacultyReport();
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid report type requested." });
        }

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};