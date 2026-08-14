const db = require('../config/db');
const Doubt = require("../models/studentDoubtModel"); // Keep this if you want to use the model

// Unified exports that match your Route expectations
exports.askDoubt = async (req, res) => {
    try {
        await Doubt.postDoubt(req.user.id, req.body.question);
        res.json({ success: true, message: "Doubt posted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.getStudentDoubts(req.user.id);
        res.json({ success: true, doubts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const DoubtSolverService = require('../services/ai/DoubtSolverService');

exports.askAI = async (req, res) => {
    const { question } = req.body;
    try {
        // Calling the AI service logic
        const answer = await DoubtSolverService.solve(req.user.id, null, question);
        res.status(200).json({ success: true, answer: answer });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: "AI Engine error: " + error.message });
    }
};
// Add these if your teacher routes need them
exports.getTeacherDoubts = async (req, res) => { /* implementation */ };
exports.replyDoubt = async (req, res) => { /* implementation */ };