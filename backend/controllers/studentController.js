const Student = require("../models/studentModel");

const getStudents = async (req, res) => {

    try {

        const students = await Student.getAllStudents();

        res.json({

            success: true,

            students

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to fetch students"

        });

    }

};

module.exports = {

    getStudents

};