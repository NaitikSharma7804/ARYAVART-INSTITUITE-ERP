const db = require("../config/db");

async function ensureParentProfile(userId) {
    let [parentRows] = await db.query("SELECT parent_id FROM parents WHERE user_id = ?", [userId]);
    if (parentRows.length === 0) {
        const [res] = await db.query("INSERT INTO parents (user_id) VALUES (?)", [userId]);
        return res.insertId;
    }
    return parentRows[0].parent_id;
}

async function getParentDashboardData(userId) {
    // 1. Ensure parent profile exists
    const parentId = await ensureParentProfile(userId);
    
    // 2. Find linked student
    let [studentRows] = await db.query(
        "SELECT s.student_id, u.full_name FROM students s JOIN users u ON s.user_id = u.user_id WHERE s.parent_id = ?", 
        [parentId]
    );

    // Fallback: if this parent has no linked student, link the first available student or demo student
    if (studentRows.length === 0) {
        const [firstStudent] = await db.query(
            "SELECT s.student_id, u.full_name FROM students s JOIN users u ON s.user_id = u.user_id LIMIT 1"
        );
        if (firstStudent.length > 0) {
            await db.query("UPDATE students SET parent_id = ? WHERE student_id = ?", [parentId, firstStudent[0].student_id]);
            studentRows = firstStudent;
        }
    }

    if (studentRows.length === 0) {
        return {
            studentName: "No Student Linked Yet",
            stats: {
                avg_test: 0,
                pending_hw: 0,
                attendance: 0
            }
        };
    }

    const student = studentRows[0];

    // 3. Fetch Live Stats (with safe fallbacks)
    let avgTest = 0;
    try {
        const [[avgResult]] = await db.query(
            "SELECT AVG(percentage) as avg FROM results WHERE student_id = ?", 
            [student.student_id]
        );
        avgTest = avgResult && avgResult.avg ? parseFloat(avgResult.avg).toFixed(1) : 0;
    } catch (e) {
        console.warn("Could not fetch avg test results:", e.message);
    }

    let pendingHw = 0;
    try {
        const [[hwCount]] = await db.query(
            "SELECT COUNT(*) as count FROM homework_submissions WHERE student_id = ? AND status = 'Pending'", 
            [student.student_id]
        );
        pendingHw = hwCount && hwCount.count ? hwCount.count : 0;
    } catch (e) {
        console.warn("Could not fetch pending homework:", e.message);
    }

    let attendancePct = 0;
    try {
        const [[att]] = await db.query(
            "SELECT (COUNT(CASE WHEN status='Present' THEN 1 END) / COUNT(*)) * 100 as percentage FROM attendance WHERE student_id = ?", 
            [student.student_id]
        );
        attendancePct = att && att.percentage ? parseFloat(att.percentage).toFixed(0) : 0;
    } catch (e) {
        console.warn("Could not fetch attendance percentage:", e.message);
    }

    return {
        studentName: student.full_name,
        stats: {
            avg_test: avgTest,
            pending_hw: pendingHw,
            attendance: attendancePct
        }
    };
}

async function getAttendanceData(userId) {
    const parentId = await ensureParentProfile(userId);

    let [studentRows] = await db.query(
        "SELECT s.student_id FROM students s WHERE s.parent_id = ?", 
        [parentId]
    );

    if (studentRows.length === 0) {
        const [firstStudent] = await db.query("SELECT student_id FROM students LIMIT 1");
        if (firstStudent.length > 0) {
            await db.query("UPDATE students SET parent_id = ? WHERE student_id = ?", [parentId, firstStudent[0].student_id]);
            studentRows = firstStudent;
        } else {
            return { latest: null, history: [] };
        }
    }

    const studentId = studentRows[0].student_id;

    // Fetch the most recent check-in
    let latest = [];
    try {
        const [latestRows] = await db.query(
            "SELECT attendance_date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 1",
            [studentId]
        );
        latest = latestRows;
    } catch (e) {}

    // Fetch history for the last 7 days
    let history = [];
    try {
        const [histRows] = await db.query(
            "SELECT attendance_date as date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 7",
            [studentId]
        );
        history = histRows;
    } catch (e) {}

    return { latest: latest[0] || null, history };
}

module.exports = {
    ensureParentProfile,
    getParentDashboardData,
    getAttendanceData
};
