const db = require("../config/db");

async function getStudentTimetable(userId) {
    const [rows] = await db.query(
        `SELECT t.day_name, t.start_time, t.end_time, s.subject_name, u.full_name AS teacher_name
         FROM timetable t
         JOIN teacher_subject ts ON t.assignment_id = ts.id
         JOIN subjects s ON ts.subject_id = s.subject_id
         JOIN teachers tr ON ts.teacher_id = tr.teacher_id
         JOIN users u ON tr.user_id = u.user_id
         JOIN students st ON ts.batch_id = st.batch_id
         WHERE st.user_id = ?
         ORDER BY FIELD(t.day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time ASC`,
        [userId]
    );
    return rows;
}

module.exports = { getStudentTimetable };