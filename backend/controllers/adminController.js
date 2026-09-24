const bcrypt = require("bcryptjs");
const db = require("../config/db"); // Adjust path as needed
const User = require("../models/userModel");

// 1. Create a new user (Student/Teacher/Parent)
exports.createUser = async (req, res) => {
    try {
        const { full_name, email, phone, password, role, qualification, experience, salary } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        // 1. Save to users table
        const userId = await User.createUser({ full_name, email, phone, password_hash, role });

        // 2. If it's a teacher, save to teachers table
        if (role === 'TEACHER') {
            await db.query(
                "INSERT INTO teachers (user_id, qualification, experience, salary, joining_date) VALUES (?, ?, ?, ?, CURDATE())",
                [userId, qualification, experience, salary]
            );
        }

        res.status(201).json({ success: true, message: "User and Teacher record created!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Delete a teacher (with dependency cleanup)
exports.deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        // Clean up dependencies first
        await db.query("DELETE FROM teacher_subject WHERE teacher_id = ?", [teacherId]);
        // Delete the teacher
        await db.query("DELETE FROM teachers WHERE teacher_id = ?", [teacherId]);

        res.json({ success: true, message: "Teacher deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};