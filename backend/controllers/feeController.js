const Fee = require("../models/feeModel");

exports.getFeeDashboardData = async (req, res) => {
    try {
        const allFees = await Fee.getAllFees();
        const pendingFees = await Fee.getPendingFees();
        res.json({ success: true, allFees, pendingFees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const { fee_id } = req.body;
        
        if (!fee_id) {
            return res.status(400).json({ success: false, message: "Please select a valid pending fee record." });
        }

        await Fee.recordPayment(fee_id);
        res.json({ success: true, message: "Payment recorded successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};