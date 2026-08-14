const Result = require("../models/testResultModel");

exports.getResults = async (req, res) => {
    console.log("DEBUG: Checking results for User ID:", req.user.id);
    // ...
}

exports.getResults = async (req, res) => {
    try {
        const results = await Result.getStudentResults(req.user.id);
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

