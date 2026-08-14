const db = require("../config/db");

async function getStudentAttendance(userId) {
    // 1. Get the student's ID
    const [studentRows] = await db.query(
        `SELECT student_id FROM students WHERE user_id = ?`, 
        [userId]
    );
    if (studentRows.length === 0) throw new Error("Student profile not found");
    const studentId = studentRows[0].student_id;

    // 2. Calculate Stats
    const [statRows] = await db.query(
        `SELECT 
            COUNT(*) AS total_classes,
            SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_total,
            SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent_total,
            SUM(CASE WHEN MONTH(attendance_date) = MONTH(CURRENT_DATE) AND status = 'Present' THEN 1 ELSE 0 END) AS present_month,
            SUM(CASE WHEN MONTH(attendance_date) = MONTH(CURRENT_DATE) THEN 1 ELSE 0 END) AS total_month
         FROM attendance
         WHERE student_id = ?`,
        [studentId]
    );

    const stats = statRows[0];
    const overallPct = stats.total_classes > 0 ? Math.round((stats.present_total / stats.total_classes) * 100) : 100;
    const monthPct = stats.total_month > 0 ? Math.round((stats.present_month / stats.total_month) * 100) : 100;
    const classesMissed = stats.absent_total || 0;

    // 3. Get Recent Attendance Logs (Last 20 classes)
    const [logRows] = await db.query(
        `SELECT a.attendance_date, a.status, s.subject_name, u.full_name AS teacher_name
         FROM attendance a
         JOIN timetable t ON a.timetable_id = t.timetable_id
         JOIN teacher_subject ts ON t.assignment_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u ON tr.user_id = u.user_id
         WHERE a.student_id = ?
         ORDER BY a.attendance_date DESC, t.start_time DESC
         LIMIT 20`,
        [studentId]
    );

    return {
        stats: {
            overallPct,
            monthPct,
            classesMissed
        },
        logs: logRows
    };
}

module.exports = { getStudentAttendance };