const Submission = require("../models/homeworkSubmissionModel");

/* ================= STUDENT ENDPOINTS ================= */

exports.getStudentHomework = async (req, res) => {
    try {
        const homework = await Submission.getStudentHomework(req.user.id);
        res.json({ success: true, homework });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.submitHomework = async (req, res) => {
    try {
        const data = {
            user_id: req.user.id,
            homework_id: req.body.homework_id,
            remarks: req.body.remarks,
            file_path: req.file ? `/uploads/homework_submissions/${req.file.filename}` : null
        };

        if (!data.file_path) {
            return res.status(400).json({ success: false, message: "File upload is required" });
        }

        const submissionId = await Submission.submitHomework(data);
        res.json({ success: true, message: "Homework Submitted Successfully", submission_id: submissionId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= TEACHER ENDPOINTS ================= */

exports.getTeacherHomeworkList = async (req, res) => {
    try {
        const homework = await Submission.getTeacherHomeworkList(req.user.id);
        res.json({ success: true, homework });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHomeworkSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.getHomeworkSubmissions(req.params.homeworkId, req.user.id);
        res.json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        await Submission.gradeSubmission(req.params.submissionId, {
            teacher_marks: req.body.teacher_marks,
            teacher_feedback: req.body.teacher_feedback,
            status: req.body.status // e.g., 'Approved', 'Rejected', 'Checked'
        });
        res.json({ success: true, message: "Submission Graded Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};