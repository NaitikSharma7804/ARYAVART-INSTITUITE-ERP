const Doubt = require("../models/studentDoubtModel");

exports.postDoubt = async (req, res) => {
    try {
        await Doubt.postDoubt(req.user.id, req.body.question);
        res.json({ success: true, message: "Doubt posted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStudentDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.getStudentDoubts(req.user.id);
        res.json({ success: true, doubts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};