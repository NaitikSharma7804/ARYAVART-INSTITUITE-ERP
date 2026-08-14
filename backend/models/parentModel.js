const db = require("../config/db");

async function getParentDashboardData(userId) {
    // 1. Get parent_id and student_id
    const [parentRows] = await db.query("SELECT parent_id FROM parents WHERE user_id = ?", [userId]);
    if (parentRows.length === 0) throw new Error("Parent profile not found.");
    
    const [studentRows] = await db.query(
        "SELECT s.student_id, u.full_name FROM students s JOIN users u ON s.user_id = u.user_id WHERE s.parent_id = ?", 
        [parentRows[0].parent_id]
    );
    if (studentRows.length === 0) throw new Error("No student linked.");
    const student = studentRows[0];

    // 2. Fetch Live Stats
    // Average Test Score from 'results'
    const [[avgResult]] = await db.query(
        "SELECT AVG(percentage) as avg FROM results WHERE student_id = ?", 
        [student.student_id]
    );

    // Pending Homework from 'homework_submissions'
    const [[hwCount]] = await db.query(
        "SELECT COUNT(*) as count FROM homework_submissions WHERE student_id = ? AND status = 'Pending'", 
        [student.student_id]
    );

    // Attendance from 'attendance'
    const [[att]] = await db.query(
        "SELECT (COUNT(CASE WHEN status='Present' THEN 1 END) / COUNT(*)) * 100 as percentage FROM attendance WHERE student_id = ?", 
        [student.student_id]
    );

    return {
        studentName: student.full_name,
        stats: {
            avg_test: avgResult.avg ? parseFloat(avgResult.avg).toFixed(1) : 0,
            pending_hw: hwCount.count || 0,
            attendance: att.percentage ? parseFloat(att.percentage).toFixed(0) : 0
        }
    };
}

async function getAttendanceData(userId) {
    const [studentRows] = await db.query(
        "SELECT s.student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
        [userId]
    );
    if (studentRows.length === 0) throw new Error("Student not found.");
    const studentId = studentRows[0].student_id;

    // Fetch the most recent check-in
    const [latest] = await db.query(
        "SELECT attendance_date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 1",
        [studentId]
    );

    // Fetch history for the last 7 days
    const [history] = await db.query(
        "SELECT attendance_date as date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 7",
        [studentId]
    );

    return { latest: latest[0], history };
}

module.exports = { getParentDashboardData, getAttendanceData };