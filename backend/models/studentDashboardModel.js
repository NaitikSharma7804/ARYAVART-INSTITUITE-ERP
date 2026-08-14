const db = require("../config/db");

async function getStudentDashboardData(userId) {
    // 1. Get the student's profile and batch
    const [studentRows] = await db.query(
        `SELECT student_id, batch_id FROM students WHERE user_id = ?`, 
        [userId]
    );
    
    if (studentRows.length === 0) throw new Error("Student profile not found");
    const student = studentRows[0]; // 'student' contains student_id and batch_id

    // 2. Get Today's Timetable
    let timetable = [];
    if (student.batch_id) {
        const [ttRows] = await db.query(
            `SELECT t.start_time, t.end_time, s.subject_name, u.full_name AS teacher_name
             FROM timetable t
             JOIN teacher_subject ts ON t.assignment_id = ts.id
             JOIN subjects s ON ts.subject_id = s.subject_id
             JOIN teachers tr ON ts.teacher_id = tr.teacher_id
             JOIN users u ON tr.user_id = u.user_id
             WHERE ts.batch_id = ? AND t.day_name = DAYNAME(CURDATE())
             ORDER BY t.start_time ASC`,
            [student.batch_id]
        );
        timetable = ttRows;
    }

    // 3. Calculate Live Attendance Percentage
    const [attRows] = await db.query(
        `SELECT 
            COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
            COUNT(*) AS total_count
         FROM attendance
         WHERE student_id = ?`,
        [student.student_id]
    );
    let attendancePct = 100;
    if (attRows[0].total_count > 0) {
        attendancePct = Math.round((attRows[0].present_count / attRows[0].total_count) * 100);
    }

    // 4. Count Pending Homework
    const [hwRows] = await db.query(
        `SELECT COUNT(*) AS pending
         FROM homework h
         JOIN teacher_subject ts ON h.teacher_subject_id = ts.id
         WHERE ts.batch_id = ?
           AND h.homework_id NOT IN (
               SELECT homework_id FROM homework_submissions WHERE student_id = ?
           )`,
        [student.batch_id, student.student_id]
    );
    const pendingHomework = hwRows[0].pending || 0;

    // 5. Get Last Test Score - USING student.student_id
    const [testRows] = await db.query(
        `SELECT st.obtained_marks, t.total_marks 
         FROM student_tests st
         JOIN tests t ON st.test_id = t.test_id
         WHERE st.student_id = ? AND st.status = 'Checked'
         ORDER BY st.submitted_at DESC 
         LIMIT 1`,
        [student.student_id] 
    );

    const lastScore = testRows.length > 0 
        ? Math.round((testRows[0].obtained_marks / testRows[0].total_marks) * 100) 
        : null;

    // 6. Calculate Fees Due
    const [feeRows] = await db.query(
        `SELECT SUM(amount) AS total_due
         FROM fees
         WHERE student_id = ? AND status IN ('Pending', 'Partial')`,
        [student.student_id]
    );
    const feesDue = feeRows[0].total_due || 0;

    return {
        attendancePct,
        pendingHomework,
        lastScore,
        feesDue,
        timetable
    };
}

module.exports = { getStudentDashboardData };