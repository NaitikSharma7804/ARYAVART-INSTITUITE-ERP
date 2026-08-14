const Notes = require("../models/studentNotesModel");

exports.getNotes = async (req, res) => {
    try {
        const notes = await Notes.getStudentNotes(req.user.id);
        res.json({ success: true, notes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};