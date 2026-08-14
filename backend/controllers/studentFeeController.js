const FeeModel = require("../models/studentFeeModel");

exports.getFees = async (req, res) => {
    try {
        const data = await FeeModel.getStudentFees(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};