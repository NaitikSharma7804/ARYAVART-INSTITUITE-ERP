const db = require("../config/db"); // Add this line!
const ParentModel = require("../models/parentModel");
// const ParentModel = require("../models/parentModel");

exports.getDashboard = async (req, res) => {
    try {
        // req.user.id comes from your auth middleware
        const data = await ParentModel.getParentDashboardData(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });
        const studentId = studentRows[0].student_id;

        // Fetch latest record[cite: 2]
        const [latest] = await db.query(
            "SELECT attendance_date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 1",
            [studentId]
        );

        // Fetch history[cite: 2]
        const [history] = await db.query(
            "SELECT attendance_date as date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC LIMIT 7",
            [studentId]
        );

        // Send structured object[cite: 2]
        res.json({ success: true, data: { latest: latest[0], history } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFees = async (req, res) => {
    try {
        // 1. Get the student linked to this parent
        const [studentRows] = await db.query(
            "SELECT s.student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });

        // 2. Fetch fee records for this student
        const [fees] = await db.query(
            "SELECT amount, due_date, status FROM fees WHERE student_id = ? ORDER BY due_date ASC",
            [studentRows[0].student_id]
        );

        res.json({ success: true, data: fees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPerformance = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT s.student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });

        // Fetch performance data
        const [results] = await db.query(
            "SELECT r.percentage as score, t.title as name FROM results r JOIN tests t ON r.test_id = t.test_id WHERE r.student_id = ? ORDER BY r.test_id ASC",
            [studentRows[0].student_id]
        );

        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHomeworkStatus = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });

        // Fetch homework and submission status
        const [homework] = await db.query(
            `SELECT h.title, h.due_date, hs.status as submission_status 
             FROM homework h 
             LEFT JOIN homework_submissions hs ON h.homework_id = hs.homework_id AND hs.student_id = ?
             WHERE h.homework_id IN (SELECT homework_id FROM homework)`, // Adjust join as per your schema
            [studentRows[0].student_id]
        );

        res.json({ success: true, data: homework });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRemarks = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });

        // Update the query to point to your new 'remarks' table
        const [remarks] = await db.query(
            "SELECT teacher_name as teacher, note, date FROM remarks WHERE student_id = ? ORDER BY date DESC",
            [studentRows[0].student_id]
        );

        res.json({ success: true, data: remarks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUpcomingExams = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });

        // Fetch upcoming tests
        const [tests] = await db.query(
            "SELECT title, test_date as date, description as syllabus FROM tests WHERE test_date >= CURDATE() ORDER BY test_date ASC",
            []
        );

        res.json({ success: true, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNotices = async (req, res) => {
    try {
        const [notices] = await db.query(
            "SELECT title, description as body, created_at as date FROM notices ORDER BY created_at DESC"
        );
        res.json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const [studentRows] = await db.query(
            "SELECT student_id FROM students s JOIN parents p ON s.parent_id = p.parent_id WHERE p.user_id = ?", 
            [req.user.id]
        );
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });
        const studentId = studentRows[0].student_id;

        // 1. Avg Attendance
        const [attRows] = await db.query(
            "SELECT AVG(CASE WHEN status='Present' THEN 1 ELSE 0 END) * 100 as avg FROM attendance WHERE student_id = ? AND MONTH(attendance_date) = MONTH(CURRENT_DATE())",
            [studentId]
        );
        // Define 'attendance' here from the query result
        const attendance = Math.round(attRows[0].avg || 0);

        // 2. Avg Test Score
        const [scoreRows] = await db.query(
            `SELECT AVG(r.percentage) as avg 
             FROM results r 
             JOIN tests t ON r.test_id = t.test_id 
             WHERE r.student_id = ? AND MONTH(t.test_date) = MONTH(CURRENT_DATE())`,
            [studentId]
        );
        // Define 'testScore' here
        const testScore = Math.round(scoreRows[0].avg || 0);

        // 3. Homework Completed
        const [hwRows] = await db.query(
            "SELECT COUNT(*) as total FROM homework_submissions WHERE student_id = ? AND status='Submitted' AND MONTH(submitted_at) = MONTH(CURRENT_DATE())",
            [studentId]
        );
        // Define 'homework' here
        const homework = hwRows[0].total || 0;

        // Now all variables are defined and can be used in the response
        res.json({ 
            success: true, 
            data: {
                attendance: attendance,
                testScore: testScore,
                homework: homework,
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
        // Fetch messages where this parent is either the sender or the receiver
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