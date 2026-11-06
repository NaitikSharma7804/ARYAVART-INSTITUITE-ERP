const db = require('../config/db');
const StudentDoubt = require("../models/studentDoubtModel");
const DoubtModel = require("../models/doubtModel");

// Unified exports that match your Route expectations
exports.askDoubt = async (req, res) => {
    try {
        await StudentDoubt.postDoubt(req.user.id, req.body.question);
        res.json({ success: true, message: "Doubt posted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDoubts = async (req, res) => {
    try {
        const doubts = await StudentDoubt.getStudentDoubts(req.user.id);
        res.json({ success: true, doubts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const DoubtSolverService = require('../services/ai/DoubtSolverService');

exports.askAI = async (req, res) => {
    const { question } = req.body;
    try {
        const answer = await DoubtSolverService.solve(req.user.id, null, question);
        res.status(200).json({ success: true, answer: answer });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: "AI Engine error: " + error.message });
    }
};

// Teacher routes
exports.getTeacherDoubts = async (req, res) => {
    try {
        const doubts = await DoubtModel.getTeacherDoubts(req.user.id);
        res.json({ success: true, doubts: doubts || [] });
    } catch (err) {
        console.error("Get Teacher Doubts Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.replyDoubt = async (req, res) => {
    try {
        const { answer } = req.body;
        if (!answer || !answer.trim()) {
            return res.status(400).json({ success: false, message: "Answer is required." });
        }
        await DoubtModel.replyToDoubt(req.params.id, answer.trim(), req.user.id);
        res.json({ success: true, message: "Doubt replied successfully!" });
    } catch (err) {
        console.error("Reply Doubt Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
