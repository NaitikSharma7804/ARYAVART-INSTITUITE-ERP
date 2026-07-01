const Class = require("../models/classModel");

const getClasses = async (req, res) => {

    try {

        const classes = await Class.getClasses();

        res.json({

            success: true,

            classes

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to fetch classes"

        });

    }

};

const addClass = async (req, res) => {

    try {

        const { class_name } = req.body;

        if (!class_name) {

            return res.status(400).json({

                success: false,

                message: "Class name required"

            });

        }

        await Class.addClass(class_name);

        res.json({

            success: true,

            message: "Class added"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to add class"

        });

    }

};

module.exports = {

    getClasses,

    addClass

};