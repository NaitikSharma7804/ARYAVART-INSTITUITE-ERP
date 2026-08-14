const Videos = require("../models/studentVideoModel");

exports.getVideos = async (req, res) => {
    try {
        const videos = await Videos.getStudentVideos(req.user.id);
        res.json({ success: true, videos });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};