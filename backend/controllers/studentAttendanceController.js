const Attendance = require("../models/studentAttendanceModel");

exports.getAttendance = async (req, res) => {
    try {
        const data = await Attendance.getStudentAttendance(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};