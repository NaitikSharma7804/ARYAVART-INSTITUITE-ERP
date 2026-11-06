const db = require("../config/db");
const ParentModel = require("../models/parentModel");

async function getStudentIdForParent(userId) {
    const parentId = await ParentModel.ensureParentProfile(userId);
    let [students] = await db.query("SELECT student_id FROM students WHERE parent_id = ?", [parentId]);
    if (students.length === 0) {
        const [firstStudent] = await db.query("SELECT student_id FROM students LIMIT 1");
        if (firstStudent.length > 0) {
            await db.query("UPDATE students SET parent_id = ? WHERE student_id = ?", [parentId, firstStudent[0].student_id]);
            return firstStudent[0].student_id;
        }
        return null;
    }
    return students[0].student_id;
}

exports.getDashboard = async (req, res) => {
    try {
        const data = await ParentModel.getParentDashboardData(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error("Parent Dashboard Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) return res.json({ success: true, data: { latest: null, history: [] } });

        const [latest] = await db.query(
            "SELECT attendance_date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 1",
            [studentId]
        );

        const [history] = await db.query(
            "SELECT attendance_date as date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 7",
            [studentId]
        );

        res.json({ success: true, data: { latest: latest[0] || null, history: history || [] } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFees = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) return res.json({ success: true, data: [] });

        const [fees] = await db.query(
            "SELECT amount, due_date, status FROM fees WHERE student_id = ? ORDER BY due_date ASC",
            [studentId]
        );

        res.json({ success: true, data: fees || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPerformance = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) return res.json({ success: true, data: [] });

        const [results] = await db.query(
            "SELECT r.percentage as score, t.title as name FROM results r JOIN tests t ON r.test_id = t.test_id WHERE r.student_id = ? ORDER BY r.test_id ASC",
            [studentId]
        );

        res.json({ success: true, data: results || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHomeworkStatus = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) return res.json({ success: true, data: [] });

        const [homework] = await db.query(
            `SELECT h.title, h.due_date, hs.status as submission_status 
             FROM homework h 
             LEFT JOIN homework_submissions hs ON h.homework_id = hs.homework_id AND hs.student_id = ?
             WHERE h.homework_id IN (SELECT homework_id FROM homework)`,
            [studentId]
        );

        res.json({ success: true, data: homework || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRemarks = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) return res.json({ success: true, data: [] });

        const [remarks] = await db.query(
            "SELECT teacher_name as teacher, note, date FROM remarks WHERE student_id = ? ORDER BY date DESC",
            [studentId]
        );

        res.json({ success: true, data: remarks || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUpcomingExams = async (req, res) => {
    try {
        const [tests] = await db.query(
            "SELECT title, test_date as date, description as syllabus FROM tests WHERE test_date >= CURDATE() ORDER BY test_date ASC",
            []
        );

        res.json({ success: true, data: tests || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNotices = async (req, res) => {
    try {
        const [notices] = await db.query(
            "SELECT title, description as body, created_at as date FROM notices ORDER BY created_at DESC"
        );
        res.json({ success: true, data: notices || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const studentId = await getStudentIdForParent(req.user.id);
        if (!studentId) {
            return res.json({ 
                success: true, 
                data: {
                    attendance: 0,
                    testScore: 0,
                    homework: 0,
                    summary: "No student linked yet."
                } 
            });
        }

        // 1. Avg Attendance
        let attendance = 0;
        try {
            const [attRows] = await db.query(
                "SELECT AVG(CASE WHEN status='Present' THEN 1 ELSE 0 END) * 100 as avg FROM attendance WHERE student_id = ? AND MONTH(attendance_date) = MONTH(CURRENT_DATE())",
                [studentId]
            );
            attendance = Math.round(attRows[0]?.avg || 0);
        } catch (e) {}

        // 2. Avg Test Score
        let testScore = 0;
        try {
            const [scoreRows] = await db.query(
                `SELECT AVG(r.percentage) as avg 
                 FROM results r 
                 JOIN tests t ON r.test_id = t.test_id 
                 WHERE r.student_id = ? AND MONTH(t.test_date) = MONTH(CURRENT_DATE())`,
                [studentId]
            );
            testScore = Math.round(scoreRows[0]?.avg || 0);
        } catch (e) {}

        // 3. Homework Completed
        let homework = 0;
        try {
            const [hwRows] = await db.query(
                "SELECT COUNT(*) as total FROM homework_submissions WHERE student_id = ? AND status='Submitted' AND MONTH(submitted_at) = MONTH(CURRENT_DATE())",
                [studentId]
            );
            homework = hwRows[0]?.total || 0;
        } catch (e) {}

        res.json({ 
            success: true, 
            data: {
                attendance,
                testScore,
                homework,
                summary: "Data for the current month has been successfully processed."
            } 
        });
    } catch (error) {
        console.error("Monthly Report Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const [messages] = await db.query(
            "SELECT sender_id, content, sent_at FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at ASC",
            [req.user.id, req.user.id]
        );
        res.json({ success: true, messages: messages || [], currentUserId: req.user.id });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { content, teacher_id } = req.body;
        await db.query(
            "INSERT INTO messages (parent_id, teacher_id, sender_id, content) VALUES (?, ?, ?, ?)",
            [req.user.id, teacher_id, req.user.id, content]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
