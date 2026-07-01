const Assignment = require("../models/assignmentModel");

exports.getAssignments = async (req, res) => {

    try {

        const assignments = await Assignment.getAssignments();

        res.json({
            success: true,
            assignments
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.createAssignment = async (req, res) => {

    try {

        const id = await Assignment.createAssignment(req.body);

        res.status(201).json({
            success: true,
            assignmentId: id
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.deleteAssignment = async (req, res) => {

    try {

        await Assignment.deleteAssignment(req.params.id);

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