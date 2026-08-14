const Timetable = require("../models/studentTimetableModel");

exports.getTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.getStudentTimetable(req.user.id);
        res.json({ success: true, timetable });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};