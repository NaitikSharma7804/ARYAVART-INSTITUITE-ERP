const Attendance = require("../models/attendancemodel");

/*
==========================================
Get Students For Selected Lecture
==========================================
*/

exports.getStudents = async (req, res) => {

    try {

        const timetableId = req.params.timetableId;

        const students = await Attendance.getStudentsForClass(
            timetableId
        );

        res.json({
            success: true,
            students
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/*
==========================================
Save Attendance
==========================================
*/

exports.markAttendance = async (req, res) => {

    try {

        await Attendance.markAttendance(req.body);

        res.json({
            success: true,
            message: "Attendance Saved Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};