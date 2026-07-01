const Subject = require("../models/subjectModel");

exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.getAllSubjects();

        res.json({
            success: true,
            subjects
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.createSubject = async (req, res) => {

    try {

        const id = await Subject.createSubject(req.body);

        res.status(201).json({
            success: true,
            subjectId: id
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getSubject = async (req, res) => {

    try {

        const subject = await Subject.getSubjectById(req.params.id);

        res.json({
            success: true,
            subject
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.updateSubject = async (req, res) => {

    try {

        await Subject.updateSubject(req.params.id, req.body);

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

exports.deleteSubject = async (req, res) => {

    try {

        await Subject.deleteSubject(req.params.id);

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