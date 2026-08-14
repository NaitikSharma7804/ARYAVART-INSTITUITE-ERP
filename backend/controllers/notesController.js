const Notes = require("../models/notesModel");

/*
=====================================
Get Teacher Assignments
=====================================
*/

exports.getOptions = async (req, res) => {

    try {

        const assignments = await Notes.getTeacherAssignments(req.user.id);

        res.json({

            success: true,

            assignments

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Upload Note
=====================================
*/

exports.uploadNote = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please select a PDF."

            });

        }

        await Notes.uploadNote({

            teacher_subject_id: req.body.teacher_subject_id,

            title: req.body.title,

            description: req.body.description,

            file_path: `/uploads/notes/${req.file.filename}`

        });

        res.json({

            success: true,

            message: "Notes Uploaded Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Teacher Notes List
=====================================
*/

exports.getTeacherNotes = async (req, res) => {

    try {

        const notes = await Notes.getTeacherNotes(req.user.id);

        res.json({

            success: true,

            notes

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Delete Note
=====================================
*/

exports.deleteNote = async (req, res) => {

    try {

        const deleted = await Notes.deleteNote(

            req.params.id,

            req.user.id

        );

        if (!deleted) {

            return res.status(404).json({

                success: false,

                message: "Note not found"

            });

        }

        res.json({

            success: true,

            message: "Note Deleted Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Get Single Note
=====================================
*/

exports.getNote = async (req, res) => {

    try {

        const note = await Notes.getNoteById(

            req.params.id,

            req.user.id

        );

        if (!note) {

            return res.status(404).json({

                success: false,

                message: "Note not found"

            });

        }

        res.json({

            success: true,

            note

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Update Note
=====================================
*/

exports.updateNote = async (req, res) => {

    try {

        let filePath = null;

        if (req.file) {

            filePath = `/uploads/notes/${req.file.filename}`;

        }

        await Notes.updateNote({

            note_id: req.params.id,

            teacher_subject_id: req.body.teacher_subject_id,

            title: req.body.title,

            description: req.body.description,

            file_path: filePath

        });

        res.json({

            success: true,

            message: "Note Updated Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};