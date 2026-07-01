const Timetable = require("../models/timetableModel");

exports.getTimetable = async (req, res) => {

    try {

        const timetable = await Timetable.getAllTimetable();

        res.json({
            success: true,
            timetable
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.createTimetable = async (req, res) => {

    try {

        const id = await Timetable.createTimetable(req.body);

        res.status(201).json({
            success: true,
            timetableId: id
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

exports.deleteTimetable = async (req, res) => {

    try {

        await Timetable.deleteTimetable(req.params.id);

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};