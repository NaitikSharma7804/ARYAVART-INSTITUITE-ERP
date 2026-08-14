const Notice = require("../models/noticeModel");

exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.getAllNotices();
        res.json({ success: true, notices });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.uploadNotice = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required." });
        }

        const noticeId = await Notice.createNotice({
            title: title.trim(),
            description: description.trim(),
            created_by: req.user.id
        });

        res.json({ success: true, message: "Notice published successfully!", notice_id: noticeId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        await Notice.deleteNotice(req.params.id);
        res.json({ success: true, message: "Notice deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};