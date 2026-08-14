const Homework = require("../models/homeworkModel");

/*
====================================
Get Teacher Assignments
====================================
*/

exports.getAssignments = async (req, res) => {

    try {

        const assignments =
            await Homework.getTeacherAssignments(req.user.id);

        res.json({

            success: true,

            assignments

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
====================================
Create Homework
====================================
*/

exports.createHomework = async (req, res) => {

    try {

        const homeworkId =
            await Homework.createHomework(req.body);

        res.status(201).json({

            success: true,

            homeworkId,

            message: "Homework Uploaded Successfully"

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
====================================
Teacher Homework List
====================================
*/

exports.getHomework = async (req, res) => {

    try {

        const homework =
            await Homework.getTeacherHomework(req.user.id);

        res.json({

            success: true,

            homework

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
