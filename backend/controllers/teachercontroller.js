const Teacher = require("../models/teachermodel");

exports.getTeachers = async (req, res) => {

    try {

        const teachers = await Teacher.getAllTeachers();

        res.json({
            success: true,
            teachers
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.createTeacher = async (req, res) => {

    try {

        const id = await Teacher.createTeacher(req.body);

        res.status(201).json({
            success: true,
            teacherId: id
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.deleteTeacher = async (req, res) => {

    try {

        await Teacher.deleteTeacher(req.params.id);

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

exports.getTeacher = async (req, res) => {

    try {

        const teacher = await Teacher.getTeacherById(req.params.id);

        res.json({
            success: true,
            teacher
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.updateTeacher = async (req, res) => {

    try {

        await Teacher.updateTeacher(req.params.id, req.body);

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